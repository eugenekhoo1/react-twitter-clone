import { formatDistance, subDays } from "date-fns";
import { Link } from "react-router-dom";
import "../styles/tweetBox.css";
import "../styles/singleTweet.css";
import profile from "../styles/assets/images/profile.png";

const SingleTweetContent = ({ user, tweet, isRetweeted }) => {
  const dateObj = new Date(tweet.createdAt);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(dateObj);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Singapore",
  });

  return (
    <div>
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
            src={profile}
            style={{ width: "40px", borderRadius: "50%" }}
            alt="avatar"
          />
          <Link to={`/user/${tweet.author}`}>
            <h4 className="single-name">{tweet.author}</h4>
          </Link>
        </div>
        <p className="single-tweet-text">{tweet.text}</p>
        <div className="single-tweet-date">
          {/* {formattedTime} | {formattedDate} */}
        </div>
      </div>
    </div>
  );
};

export default SingleTweetContent;
