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
  const { user, tid } = req.body;

  try {
    const checkTweet = await query("SELECT * FROM tweets WHERE tid=$1", [tid]);

    // check tweet exists
    if (checkTweet.rowCount < 1) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // check user matches author
    if (checkTweet.rows[0].author !== user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User does not match" });
    }

    const deleteTweet = await query("DELETE FROM tweets WHERE tid=$1", [tid]);

    return res.status(200).json({ message: "Tweet deleted!" });
  } catch (err) {
    console.log(err);
  }
}

async function editTweet(req, res) {
  const { user, tid, newText } = req.body;

  try {
    const checkTweet = await query("SELECT * FROM tweets WHERE tid=$1", [tid]);

    // check tweet exists
    if (checkTweet.rowCount < 1) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // check user matches author
    if (checkTweet.rows[0].author !== user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User does not match" });
    }

    const editTweet = await query("UPDATE tweets SET text=$1 WHERE tid=$2", [
      newText,
      tid,
    ]);

    return res.status(200).json({ message: "Tweet updated!" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createTweet, replyTweet, deleteTweet, editTweet };
