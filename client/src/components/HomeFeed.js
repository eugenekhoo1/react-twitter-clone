/**
 * Home page tweets to include following + own tweets
 */

import { useEffect, useState } from "react";
import { formatDistance, subDays } from "date-fns";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import profile from "../styles/assets/images/profile.png";
import "../styles/tweetBox.css";
import Retweet from "./Retweet";
import RemoveRetweet from "./RemoveRetweet";
import Reply from "./Reply";
import LikeTweet from "./LikeTweet";
import UnlikeTweet from "./UnlikeTweet";
import MoreModal from "./MoreModal";

const HomeFeed = ({ user, id }) => {
  const axiosPrivate = useAxiosPrivate();
  const [tweets, setTweets] = useState([]);
  const [displayTweets, setDisplayTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [retweetedTweets, setRetweetedTweets] = useState([]);

  useEffect(() => {
    const getTweets = async () => {
      const response = await axiosPrivate.post(
        "/home",
        JSON.stringify({ user })
      );
      setTweets(response.data);
    };

    // If retweeted, only show original tweet with retweet header
    // WHAT IF MULTIPLE RETWEETS FOUND? Use RETWEET array?
    const getDisplayTweets = async () => {
      const filteredTweets = tweets.filter((tweet_tid) =>
        tweets.every(
          (tweet_retweetfrom) => tweet_tid.tid !== tweet_retweetfrom.retweetfrom
        )
      );
      setDisplayTweets(filteredTweets);
    };

    const getLikedTweets = async () => {
      const response = await axios.get(`/view/likedtweets/${user}`);
      setLikedTweets(response.data);
    };

    const getRetweetedTweets = async () => {
      const response = await axios.get(`/view/retweetedtweets/${user}`);
      setRetweetedTweets(response.data);
    };

    getTweets();
    getLikedTweets();
    getRetweetedTweets();
    getDisplayTweets();
  }, [tweets]);

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

  const findRetweetedTweet = (tweet) => {
    return tweets.find((item) => item.tid === tweet.retweetfrom);
  };

  return (
    <div>
      {displayTweets.map((tweet) =>
        !tweet.retweetfrom ? (
          <Link to={`/tid/${tweet.tid}`}>
            <div className="tweet-container" id={tweet.tid}>
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
        ) : (
          <Link to={`/tid/${tweet.tid}`}>
            <div className="tweet-container" id={tweet.tid}>
              <p className="retweet">
                <i className="fa-solid fa-retweet" />{" "}
                <span className="retweet-name">
                  <Link to={`/user/${tweet.author}`}>{tweet.author}</Link>{" "}
                  Retweeted
                </span>
              </p>
              <div className="tweet-header">
                <img
                  src={profile}
                  style={{ width: "40px", borderRadius: "50%" }}
                  alt="avatar"
                />
                <Link to={`/user/${findRetweetedTweet(tweet).author}`}>
                  <h4 className="name">{findRetweetedTweet(tweet).author}</h4>
                </Link>
                <p className="date-time">
                  {formatDistance(
                    subDays(new Date(findRetweetedTweet(tweet).created_at), 0),
                    new Date()
                  )}{" "}
                  ago
                </p>
              </div>
              <p className="text">{findRetweetedTweet(tweet).text}</p>
              <div className="interactions">
                <span>
                  <Reply
                    user={user}
                    tweet={findRetweetedTweet(tweet)}
                    tid={findRetweetedTweet(tweet).tid}
                    replyUser={findRetweetedTweet(tweet).author}
                    replyText={findRetweetedTweet(tweet).text}
                    replyCreatedAt={findRetweetedTweet(tweet).created_at}
                  />{" "}
                  {findRetweetedTweet(tweet).replies.length}
                </span>
                {retweetedTweets.some(
                  (retweetedTweet) =>
                    retweetedTweet.tid === findRetweetedTweet(tweet).tid
                ) ? (
                  <span>
                    <RemoveRetweet
                      user={user}
                      id={id}
                      tid={findRetweetedTweet(tweet).tid}
                      text={findRetweetedTweet(tweet).text}
                      onRemoveRetweet={() =>
                        handleRetweetAction(findRetweetedTweet(tweet), false)
                      }
                    />
                    {findRetweetedTweet(tweet).retweets.length}
                  </span>
                ) : (
                  <span>
                    <Retweet
                      user={user}
                      id={id}
                      tid={findRetweetedTweet(tweet).tid}
                      text={findRetweetedTweet(tweet).text}
                      onRetweet={() =>
                        handleRetweetAction(findRetweetedTweet(tweet), true)
                      }
                    />
                    {findRetweetedTweet(tweet).retweets.length}
                  </span>
                )}
                {likedTweets.some(
                  (likedTweet) =>
                    likedTweet.tid === findRetweetedTweet(tweet).tid
                ) ? (
                  <span>
                    <UnlikeTweet
                      user={user}
                      tid={findRetweetedTweet(tweet).tid}
                      onUnlike={() =>
                        handleLikeAction(findRetweetedTweet(tweet), false)
                      }
                    />
                    {findRetweetedTweet(tweet).likes.length}
                  </span>
                ) : (
                  <span>
                    <LikeTweet
                      user={user}
                      tid={findRetweetedTweet(tweet).tid}
                      onLike={() =>
                        handleLikeAction(findRetweetedTweet(tweet), true)
                      }
                    />
                    {findRetweetedTweet(tweet).likes.length}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
};

export default HomeFeed;
