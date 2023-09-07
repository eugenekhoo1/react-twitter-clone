import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";
import "../styles/primary.css";
import "../styles/singleTweet.css";
import "../styles/tweetBox.css";
import LeftNav from "../components/LeftNav";
import SingleTweetContent from "../components/SingleTweetContent";
import LikeTweet from "../components/LikeTweet";
import UnlikeTweet from "../components/UnlikeTweet";
import Retweet from "../components/Retweet";
import RemoveRetweet from "../components/RemoveRetweet";
import Reply from "../components/Reply";
import defaultProfile from "../styles/assets/images/default.png";

const SingleTweet = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { tid } = useParams();
  const { auth } = useAuth();
  const user = auth?.user;
  const id = auth?.id;

  const [tweet, setTweet] = useState([]);
  const [retweetArray, setRetweetArray] = useState([]);
  const [replyArray, setReplyArray] = useState([]);
  const [likeArray, setLikeArray] = useState([]);
  const [replyTextArray, setReplyTextArray] = useState([]);
  const [datetime, setDatetime] = useState(0);
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyChar, setReplyChar] = useState(0);

  useEffect(() => {
    const getTweet = async () => {
      try {
        const response = await axios.get(`/view/tweet/${tid}`);
        if (response.data[0].retweetfrom) {
          const retweetResponse = await axios.get(
            `/view/tweet/${response.data[0].retweetfrom}`
          );
          const dateObj = new Date(retweetResponse.data[0].created_at);
          setTweet(retweetResponse.data[0]);
          setRetweetArray(retweetResponse.data[0].retweets);
          setReplyArray(retweetResponse.data[0].replies);
          setLikeArray(retweetResponse.data[0].likes);
          setDatetime(retweetResponse.data[0].created_at);
          setDate(
            new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }).format(dateObj)
          );
          setTime(
            dateObj.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "Asia/Singapore",
            })
          );
          setIsRetweeted(true);
        } else {
          const dateObj = new Date(response.data[0].created_at);
          setTweet(response.data[0]);
          setRetweetArray(response.data[0].retweets);
          setReplyArray(response.data[0].replies);
          setLikeArray(response.data[0].likes);
          setDatetime(response.data[0].created_at);
          setDate(
            new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }).format(dateObj)
          );
          setTime(
            dateObj.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "Asia/Singapore",
            })
          );
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const response = await axios.get(`/view/tweet/${tid}`);
        setReplyTextArray(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getTweet();
  }, []);

  const handleRetweetAction = async (retweeted) => {
    if (retweeted) {
      setRetweetArray([...retweetArray, id]);
    } else {
      setRetweetArray((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleLikeAction = async (liked) => {
    if (liked) {
      setLikeArray([...likeArray, id]);
    } else {
      setLikeArray((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();

    let isMounted = true;
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.post(
        "/post/reply",
        JSON.stringify({ user, text: replyText, tid }),
        {
          signal: controller.signal,
        }
      );
      setReplyText("");
    } catch (err) {
      console.error(err);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  return (
    <div>
      <div className="primary">
        <div className="left">
          <LeftNav user={user} />
        </div>
        <div className="single-tweet">
          <div className="single-tweet-header">
            <span className="back-arrow" onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </span>
            <span className="single-tweet-title">
              <h3>Tweet</h3>
            </span>
          </div>
          <div className="single-tweet-container" id={tweet.tid}>
            {isRetweeted ? (
              <p className="single-retweet">
                <i className="fa-solid fa-retweet" />{" "}
                <span className="retweet-name">
                  <Link to={`/user/${user}`}>{user}</Link> Retweeted
                </span>
              </p>
            ) : null}
            <div className="single-tweet-nameplate">
              <img
                src={defaultProfile}
                style={{ width: "40px", borderRadius: "50%" }}
                alt="avatar"
              />
              <Link to={`/user/${tweet.author}`}>
                <h4 className="single-name">{tweet.author}</h4>
              </Link>
            </div>
            <p className="single-tweet-text">{tweet.text}</p>
            <div className="single-tweet-date">
              {time} | {date}
            </div>
          </div>
          <div className="single-tweet-container">
            <div className="interaction-counter">
              <span>
                <span className="interaction-counter-count">
                  {retweetArray.length}
                </span>{" "}
                Retweets
              </span>
              <span>
                <span className="interaction-counter-count">
                  {replyArray.length}
                </span>{" "}
                Replies
              </span>
              <span>
                <span className="interaction-counter-count">
                  {likeArray.length}
                </span>{" "}
                Likes
              </span>
            </div>
          </div>
          <div className="single-tweet-container">
            <div className="single-tweet-interaction">
              <span>
                <Reply
                  user={user}
                  tweet={tweet}
                  tid={tweet.tid}
                  replyUser={tweet.author}
                  replyText={tweet.text}
                  replyCreatedAt={datetime}
                />
              </span>
              {retweetArray.includes(id) ? (
                <span>
                  <RemoveRetweet
                    user={user}
                    id={id}
                    tid={tweet.tid}
                    text={tweet.text}
                    onRemoveRetweet={() => handleRetweetAction(false)}
                  />
                </span>
              ) : (
                <span>
                  <Retweet
                    user={user}
                    id={id}
                    tid={tweet.tid}
                    text={tweet.text}
                    onRetweet={() => handleRetweetAction(true)}
                  />
                </span>
              )}
              {likeArray.includes(id) ? (
                <span>
                  <UnlikeTweet
                    user={user}
                    tid={tweet.tid}
                    onUnlike={() => handleLikeAction(false)}
                  />
                </span>
              ) : (
                <span>
                  <LikeTweet
                    user={user}
                    tid={tweet.tid}
                    onLike={() => handleLikeAction(true)}
                  />
                </span>
              )}
            </div>
          </div>
          <div className="single-tweet-container" style={{ margin: "0px" }}>
            <form
              onSubmit={handleReply}
              className="single-tweet-reply-container"
            >
              <img
                src={defaultProfile}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                alt="avatar"
              />

              <textarea
                type="text"
                id="reply"
                className="single-tweet-reply-textarea"
                placeholder="Post your reply!"
                onChange={(e) => {
                  setReplyText(e.target.value);
                  setReplyChar(e.target.value.length);
                }}
                value={replyText}
              ></textarea>
              <button
                type="submit"
                className="single-tweet-reply-button"
                disabled={replyChar == 0 || replyChar > 140 ? true : false}
              >
                Reply
              </button>
            </form>
          </div>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
};

export default SingleTweet;
