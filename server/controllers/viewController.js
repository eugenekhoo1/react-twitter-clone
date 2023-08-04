// Retrieve tweets based on user follows, likes, retweets

const { query } = require("../config/db");

async function likesArray(req, res) {
  const { user } = req.params;
  try {
    const response = await query("SELECT likes FROM users WHERE username=$1", [
      user,
    ]);

    return res.status(200).send(response.rows);
  } catch (err) {
    console.error(err);
  }
}

async function likedTweets(req, res) {
  const { user } = req.params;

  SQL_QUERY = `
    SELECT *
    FROM tweets
    WHERE tid IN (
      SELECT unnest(likes)
      FROM users
      WHERE username=$1
      )
  `;

  const response = await query(SQL_QUERY, [user]);
  return res.status(200).send(response.rows);
}

async function retweetedTweets(req, res) {
  const { user } = req.params;

  SQL_QUERY = `
    SELECT *
    FROM tweets
    WHERE tid IN (
      SELECT unnest(retweets)
      FROM users
      WHERE username=$1
      )
  `;

  const response = await query(SQL_QUERY, [user]);
  return res.status(200).send(response.rows);
}

async function userTweets(req, res) {
  const { user } = req.params;

  try {
    const userTweets = await query(
      "SELECT * FROM tweets WHERE author=$1 ORDER BY tid DESC",
      [user]
    );

    return res.status(200).send(userTweets.rows);
  } catch (err) {
    console.error(err);
  }
}

async function getProfile(req, res) {
  const { user } = req.params;

  try {
    const getProfile = await query("SELECT * FROM users WHERE username=$1", [
      user,
    ]);
    return res.status(200).send(getProfile.rows);
  } catch (err) {
    console.error(err);
  }
}

async function getTweet(req, res) {
  const { tid } = req.params;

  try {
    const getTweet = await query("SELECT * FROM tweets WHERE tid=$1", [tid]);
    return res.status(200).send(getTweet.rows);
  } catch (err) {
    console.error(err);
  }
}

async function getReplies(req, res) {
  const { tid } = req.params;

  try {
    const getReplies = await query("SELECT * FROM tweets WHERE replyto=$1", [
      tid,
    ]);
    return res.status(200).send(getReplies.rows);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  likesArray,
  likedTweets,
  retweetedTweets,
  userTweets,
  getProfile,
  getTweet,
  getReplies,
};
