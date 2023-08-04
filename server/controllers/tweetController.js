const { query } = require("../config/db");

async function createTweet(req, res) {
  const { user, text } = req.body;

  try {
    const createTweet = await query(
      "INSERT INTO tweets (author, text) VALUES ($1, $2)",
      [user, text]
    );

    return res.status(200).json({ message: "Tweet created!" });
  } catch (err) {
    console.log(err);
  }
}

async function replyTweet(req, res) {
  const { user, text, tid } = req.body;

  const tweetResponse = await query("SELECT * FROM tweets WHERE tid=$1", [tid]);
  const userResponse = await query("SELECT * FROM users WHERE username=$1", [
    user,
  ]);

  try {
    // Create tweet
    const createTweet = await query(
      "INSERT INTO tweets (author, text, replyto) VALUES ($1, $2, $3) RETURNING tid",
      [user, text, tid]
    );

    // Update tweets' replies array (tid)
    const t_repliesArray = [
      ...tweetResponse.rows[0].replies,
      createTweet.rows[0].tid,
    ];
    const t_updateRepliesArray = await query(
      "UPDATE tweets SET replies=$1 WHERE tid=$2",
      [t_repliesArray, tid]
    );

    // Update user's replies array (tid)
    const u_repliesArray = [
      ...userResponse.rows[0].replies,
      createTweet.rows[0].tid,
    ];
    const u_updateRepliesArray = await query(
      "UPDATE users SET replies=$1 WHERE username=$2",
      [u_repliesArray, user]
    );

    return res.status(200).json({ message: "Reply created!" });
  } catch (err) {
    console.log(err);
  }
}

async function deleteTweet(req, res) {
  const { id } = req.body;

  try {
    const checkTweet = await query("SELECT * FROM tweets WHERE id=$1", [id]);
    if (checkTweet.rowCount < 1) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    const deleteTweet = await query(
      "UPDATE tweets SET deleted=true WHERE id=$1",
      [id]
    );

    return res.status(200).json({ message: "Tweet deleted!" });
  } catch (err) {
    console.log(err);
  }
}

async function editTweet(req, res) {
  const { id, newText } = req.body;

  try {
    if (checkTweet.rowCount < 1) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    const editTweet = await query("UPDATE tweets SET text=$1 WHERE id=$2", [
      newText,
      id,
    ]);

    return res.status(200).json({ message: "Tweet updated!" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createTweet, replyTweet, deleteTweet, editTweet };
