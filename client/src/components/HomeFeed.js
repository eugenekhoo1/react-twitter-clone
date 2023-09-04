import { formatDistance, subDays } from "date-fns";
import { Link } from "react-router-dom";
import defaultProfile from "../styles/assets/images/default.png";
import "../styles/tweetBox.css";
import Retweet from "./Retweet";
import RemoveRetweet from "./RemoveRetweet";
import Reply from "./Reply";
import LikeTweet from "./LikeTweet";
import UnlikeTweet from "./UnlikeTweet";
import MoreModal from "./MoreModal";

const HomeFeed = ({
  user,
  id,
  tweets,
  displayTweets,
  likedTweets,
  retweetedTweets,
  onLike,
  onRetweet,
}) => {
  const findRetweetedTweet = (tweet) => {
    return tweets.find((item) => item.tid === tweet.retweetfrom);
  };

  return (
    <div>
      {console.log(displayTweets)}
      {displayTweets.map((tweet) =>
        !tweet.retweetfrom ? (
          <Link to={`/tid/${tweet.tid}`}>
            <div className="tweet-container" id={tweet.tid}>
              <div className="tweet-header">
                {tweet.avatar ? (
                  <img
                    src={tweet.avatar}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    alt="avatar"
                  />
                ) : (
                  <img
                    src={defaultProfile}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    alt="avatar"
                  />
                )}

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
                      onRemoveRetweet={() => onRetweet(tweet, false)}
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
                      onRetweet={() => onRetweet(tweet, true)}
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
                      onUnlike={() => onLike(tweet, false)}
                    />
                    {tweet.likes.length}
                  </span>
                ) : (
                  <span>
                    <LikeTweet
                      user={user}
                      tid={tweet.tid}
                      onLike={() => onLike(tweet, true)}
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
                {tweet.avatar ? (
                  <img
                    src={tweet.avatar}
                    style={{ width: "40px", borderRadius: "50%" }}
                    alt="avatar"
                  />
                ) : (
                  <img
                    src={defaultProfile}
                    style={{ width: "40px", borderRadius: "50%" }}
                    alt="avatar"
                  />
                )}

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
                        onRetweet(findRetweetedTweet(tweet), false)
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
                        onRetweet(findRetweetedTweet(tweet), true)
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
                      onUnlike={() => onLike(findRetweetedTweet(tweet), false)}
                    />
                    {findRetweetedTweet(tweet).likes.length}
                  </span>
                ) : (
                  <span>
                    <LikeTweet
                      user={user}
                      tid={findRetweetedTweet(tweet).tid}
                      onLike={() => onLike(findRetweetedTweet(tweet), true)}
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
