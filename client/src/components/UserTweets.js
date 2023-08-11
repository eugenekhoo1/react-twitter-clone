import { formatDistance, subDays } from "date-fns";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profile from "../styles/assets/images/profile.png";
import "../styles/tweetBox.css";
import LikeTweet from "./LikeTweet";
import UnlikeTweet from "./UnlikeTweet";
import Retweet from "./Retweet";
import RemoveRetweet from "./RemoveRetweet";
import Reply from "./Reply";
import MoreModal from "./MoreModal";

const UserTweets = ({ user, id, viewUser }) => {
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [retweetedTweets, setRetweetedTweets] = useState([]);

  useEffect(() => {
    const getUserTweets = async () => {
      const response = await axios.get(`/view/tweets/${viewUser}`);
      setTweets(response.data);
    };

    const getLikedTweets = async () => {
      const response = await axios.get(`/view/likedtweets/${user}`);
      setLikedTweets(response.data);
    };

    const getRetweetedTweets = async () => {
      const response = await axios.get(`/view/retweetedtweets/${user}`);
      setRetweetedTweets(response.data);
    };

    getUserTweets();
    getLikedTweets();
    getRetweetedTweets();
  }, []);

  const handleLikeAction = async (tweet, liked) => {
    if (liked) {
      // Update likes count in likedTweets
      const targetTweet = tweet;
      targetTweet.likes.push(id);
      setLikedTweets((prev) => [...prev, targetTweet]);

      // Update likes count in tweets
      const newTweetsArray = tweets.map((item) =>
        item.tid === tweet.tid ? targetTweet : item
      );
      setTweets(newTweetsArray);
    } else {
      setLikedTweets((prev) => prev.filter((item) => item.tid !== tweet.tid));
      const targetTweet = tweet;
      targetTweet.likes = targetTweet.likes.filter((item) => item !== id);
      const newTweetsArray = tweets.map((item) =>
        item.tid === tweet.tid ? targetTweet : item
      );
      setTweets(newTweetsArray);
    }
  };

  const handleRetweetAction = async (tweet, retweeted) => {
    if (retweeted) {
      // Update user's retweets array (retweets: tid)
      const targetTweet = tweet;
      targetTweet.retweets.push(id);
      setRetweetedTweets((prev) => [...prev, targetTweet]);

      // Update tweet's retweets array (retweets: userid)
      const newTweetsArray = tweets.map((item) =>
        item.tid === tweet.tid ? targetTweet : item
      );
      setTweets(newTweetsArray);
    } else {
      // Update user's retweeted array (retweets: tid)
      setRetweetedTweets((prev) =>
        prev.filter((item) => item.tid !== tweet.tid)
      );

      // Update tweet's retweeted array (retweets: userid)
      const targetTweet = tweet;
      targetTweet.retweets = targetTweet.retweets.filter((item) => item !== id);
      const newTweetsArray = tweets.map((item) =>
        item.tid === tweet.tid ? targetTweet : item
      );
      setTweets(newTweetsArray);
    }
  };

  return (
    <div>
      {tweets.map((tweet) => (
        <Link to={`/tid/${tweet.tid}`}>
          <div className="tweet-container" id={tweet.tid}>
            {tweet.retweetfrom ? (
              <p className="retweet">
                <i className="fa-solid fa-retweet" />{" "}
                <span className="retweet-name">
                  <Link to={`/user/${user}`}>{user}</Link> Retweeted
                </span>
              </p>
            ) : null}
            <div className="tweet-header">
              <img
                src={profile}
                style={{ width: "40px", borderRadius: "50%" }}
                alt="avatar"
              />
              <Link to={`/user/${tweet.author}`}>
                <h4 className="name">{tweet.author}</h4>
              </Link>
              <p className="date-time">
                {formatDistance(
                  subDays(new Date(tweet.created_at), 0),
                  new Date()
                )}{" "}
                ago
              </p>
              <div className="more-modal">
                <MoreModal
                  tid={tweet.tid}
                  user={user}
                  tweetAuthor={tweet.author}
                  retweeted={tweet.retweeted}
                />
              </div>
            </div>
            <p className="text">{tweet.text}</p>
            <div className="interactions">
              <span>
                <Reply
                  user={user}
                  tweet={tweet}
                  tid={tweet.tid}
                  replyUser={tweet.author}
                  replyText={tweet.text}
                  replyCreatedAt={tweet.created_at}
                />{" "}
                {tweet.replies.length}
              </span>
              {retweetedTweets.some(
                (retweetedTweet) => retweetedTweet.tid === tweet.tid
              ) ? (
                <span>
                  <RemoveRetweet
                    user={user}
                    id={id}
                    tid={tweet.tid}
                    text={tweet.text}
                    onRemoveRetweet={() => handleRetweetAction(tweet, false)}
                  />
                  {tweet.retweets.length}
                </span>
              ) : (
                <span>
                  <Retweet
                    user={user}
                    id={id}
                    tid={tweet.tid}
                    text={tweet.text}
                    onRetweet={() => handleRetweetAction(tweet, true)}
                  />
                  {tweet.retweets.length}
                </span>
              )}
              {likedTweets.some(
                (likedTweet) => likedTweet.tid === tweet.tid
              ) ? (
                <span>
                  <UnlikeTweet
                    user={user}
                    tid={tweet.tid}
                    onUnlike={() => handleLikeAction(tweet, false)}
                  />
                  {tweet.likes.length}
                </span>
              ) : (
                <span>
                  <LikeTweet
                    user={user}
                    tid={tweet.tid}
                    onLike={() => handleLikeAction(tweet, true)}
                  />
                  {tweet.likes.length}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserTweets;
