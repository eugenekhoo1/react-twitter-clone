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
  // User's tweets + retweets
  const { user } = req.params;

  try {
    SQL_QUERY = `
      SELECT 
        t1.tid as tid,
        t2.author as author,
        t2.text as text,
        t2.replyto as replyto,
        t2.likes as likes,
        t2.retweets as retweets,
        t2.replies as replies,
        t2.created_at as created_at,
        t2.tid as retweetfrom,
        true as retweeted,
        u.avatar as avatar
      FROM tweets t1
      INNER JOIN tweets t2
      ON t1.retweetfrom = t2.tid
      LEFT JOIN users u
      ON t2.author = u.username
      WHERE t1.author=$1 
      AND t1.retweetfrom is not null
      UNION
      SELECT
        t.*,
        false as retweeted,
        u.avatar as avatar
      FROM tweets t
      LEFT JOIN users u
      ON t.author = u.username
      WHERE author=$1 AND retweetfrom is null
      ORDER BY tid DESC;
`;
    const userTweets = await query(SQL_QUERY, [user]);

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
