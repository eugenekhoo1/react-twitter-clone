const { query } = require("../config/db");

async function followUser(req, res) {
  const { user, followUser } = req.body;

  const userResponse = await query("SELECT * FROM users WHERE username=$1", [
    user,
  ]);

  const userId = userResponse.rows[0].id;

  const followeeResponse = await query(
    "SELECT * FROM users WHERE username=$1",
    [followUser]
  );

  const followId = followeeResponse.rows[0].id;

  // Check if user is in followUser's follower array
  if (followeeResponse.rows[0].follower.includes(userId)) {
    return res.status(409).json({ message: "Already following" });
  } else {
    const followerArray = [...followeeResponse.rows[0].follower, userId];
    const addUserToFollower = await query(
      "UPDATE users SET follower=$1 WHERE id=$2",
      [followerArray, followId]
    );
  }

  // Check if followUser is in user's following array
  if (userResponse.rows[0].following.includes(followId)) {
    return res.status(409).json({ message: "Already following!" });
  } else {
    const followingArray = [...userResponse.rows[0].following, followId];
    const addUserToFollowing = await query(
      "UPDATE users SET following=$1 WHERE id=$2",
      [followingArray, userId]
    );
  }

  return res.status(201).json({ message: "Followed!" });
}

async function unfollowUser(req, res) {
  const { user, unfollowUser } = req.body;

  const userResponse = await query("SELECT * FROM users WHERE username=$1", [
    user,
  ]);

  const userId = userResponse.rows[0].id;

  const followeeResponse = await query(
    "SELECT * FROM users WHERE username=$1",
    [unfollowUser]
  );

  const unfollowId = followeeResponse.rows[0].id;

  try {
    // Remove user id from followee's follower array if present
    if (followeeResponse.rows[0].follower.includes(userId)) {
      const followerArray = followeeResponse.rows[0].follower.filter(
        (id) => id !== userId
      );
      const removeUserFromFollower = await query(
        "UPDATE users SET follower=$1 WHERE id=$2",
        [followerArray, unfollowId]
      );
    }

    // Remove followee id from user's following array if present
    if (userResponse.rows[0].following.includes(unfollowId)) {
      const followingArray = userResponse.rows[0].following.filter(
        (id) => id !== unfollowId
      );
      const removeUserFromFollowing = await query(
        "UPDATE users SET following=$1 WHERE id=$2",
        [followingArray, userId]
      );
    }

    return res.status(201).json({ message: "Unfollowed!" });
  } catch (err) {
    console.error(err);
  }
}

// Toggle Like
async function likeTweet(req, res) {
  const { user, tid } = req.body;

  const userResponse = await query("SELECT * FROM users WHERE username=$1", [
    user,
  ]);

  const tweetResponse = await query("SELECT * FROM tweets WHERE tid=$1", [tid]);

  if (userResponse.rows[0].likes.includes(tid)) {
    // Unlike
    // Update likes array (users)
    const u_likesArray = userResponse.rows[0].likes.filter(
      (tweet_id) => tweet_id !== tid
    );
    const u_updateLikesArray = await query(
      "UPDATE users SET likes=$1 WHERE username=$2",
      [u_likesArray, user]
    );

    // Update likes array (tweets)
    const user_id = userResponse.rows[0].id;
    const t_likesArray = tweetResponse.rows[0].likes.filter(
      (id) => id !== user_id
    );
    const t_updateLikesArray = await query(
      "UPDATE tweets SET likes=$1 WHERE tid=$2",
      [t_likesArray, tid]
    );

    return res.status(201).json({ message: "Tweet Unliked!" });
  } else {
    // Like
    // Update likes array (user)
    const u_likesArray = [...userResponse.rows[0].likes, tid];
    const u_updateLikesArray = await query(
      "UPDATE users SET likes=$1 WHERE username=$2",
      [u_likesArray, user]
    );

    // Update likes array (tweet)
    const user_id = userResponse.rows[0].id;
    const t_likesArray = [...tweetResponse.rows[0].likes, user_id];
    const t_updateLikesArray = await query(
      "UPDATE tweets SET likes=$1 WHERE tid=$2",
      [t_likesArray, tid]
    );

    return res.status(201).json({ message: "Tweet Liked!" });
  }
}

// Toggle retweet
async function retweet(req, res) {
  const { user, id, tid, text } = req.body;

  const userResponse = await query("SELECT * FROM users WHERE username=$1", [
    user,
  ]);
  console.log(userResponse.rows);
  const tweetResponse = await query("SELECT * FROM tweets WHERE tid=$1", [tid]);

  if (tweetResponse.rows[0].retweets.includes(id)) {
    // Remove tweet
    try {
      SQL_QUERY = `
      DELETE FROM tweets
      WHERE tid=(
        SELECT tid
        FROM tweets
        WHERE retweetFrom=$1 AND author=$2
      )
    `;
      const removeTweet = await query(SQL_QUERY, [tid, user]);

      // Remove user id from retweet array (tweets)
      const t_retweetsArray = tweetResponse.rows[0].retweets.filter(
        (user_id) => user_id !== id
      );
      const t_updateRetweetsArray = await query(
        "UPDATE tweets SET retweets=$1 WHERE tid=$2",
        [t_retweetsArray, tid]
      );

      // Remove tid from user
      const u_retweetsArray = userResponse.rows[0].retweets.filter(
        (item) => item !== tid
      );
      const u_updateRetweetsArray = await query(
        "UPDATE users SET retweets=$1 WHERE username=$2",
        [u_retweetsArray, user]
      );

      return res.status(200).json({ message: "Retweet removed!" });
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      // Create new retweeted tweet
      const createPost = await query(
        "INSERT INTO tweets (author, text, retweetFrom) VALUES ($1, $2, $3)",
        [user, text, tid]
      );

      // Update retweets array
      const t_retweetsArray = [...tweetResponse.rows[0].retweets, id];

      const t_updateRetweetArray = await query(
        "UPDATE tweets SET retweets=$1 WHERE tid=$2",
        [t_retweetsArray, tid]
      );

      // Update tid in user
      const u_retweetsArray = [...userResponse.rows[0].retweets, tid];
      const u_updateRetweetsArray = await query(
        "UPDATE users SET retweets=$1 WHERE username=$2",
        [u_retweetsArray, user]
      );

      return res.status(200).json({ message: "Retweeted!" });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = { followUser, unfollowUser, likeTweet, retweet };
