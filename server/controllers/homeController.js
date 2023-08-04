const { query } = require("../config/db");

async function homeFeed(req, res) {
  const { user } = req.body;
  console.log(user);

  const SQL_QUERY = `
    SELECT * 
    FROM tweets
    WHERE author IN (  
        SELECT username
        FROM users
        WHERE id IN (
            SELECT unnest(following)
            FROM users
            WHERE username=$1
            )  
        UNION
        SELECT $1
        )
    ORDER BY tid DESC
  `;

  try {
    const response = await query(SQL_QUERY, [user]);
    return res.status(200).send(response.rows);
  } catch (err) {
    console.log(err);
  }
}

module.exports = homeFeed;
