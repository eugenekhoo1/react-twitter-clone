import LeftNav from "../components/LeftNav";
import HomePageTweet from "../components/HomePageTweet";
import HomeFeed from "../components/HomeFeed";
import useAuth from "../hooks/useAuth";
import "../styles/home.css";
import "../styles/primary.css";
import SearchBar from "../components/SearchBar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const Home = () => {
  const { auth } = useAuth();
  const user = auth?.user;
  const id = auth?.id;

  const axiosPrivate = useAxiosPrivate();

  const [tweets, setTweets] = useState([]);
  const [displayTweets, setDisplayTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [retweetedTweets, setRetweetedTweets] = useState([]);

  useEffect(() => {
    const getTweets = async () => {
      const tweetsResponse = await axiosPrivate.post(
        "/home",
        JSON.stringify({ user })
      );
      setTweets(tweetsResponse.data);

      const filteredTweets = tweetsResponse.data.filter((tweet_tid) =>
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
    <>
      <div className="primary">
        <div className="left">
          <LeftNav user={user} />
        </div>
        <div className="home">
          <div className="home-header">
            <h3 className="home-title">Home</h3>
          </div>
          <HomePageTweet user={user} />
          <HomeFeed
            user={user}
            id={id}
            tweets={tweets}
            displayTweets={displayTweets}
            likedTweets={likedTweets}
            retweetedTweets={retweetedTweets}
            onLike={handleLikeAction}
            onRetweet={handleRetweetAction}
          />
        </div>
        <div className="right">
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default Home;
