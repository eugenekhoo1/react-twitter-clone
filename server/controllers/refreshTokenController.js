const { query } = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function refreshToken(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const checkToken = await query("SELECT * FROM users WHERE refreshtoken=$1", [
    refreshToken,
  ]);

  if (checkToken.rowCount === 0) {
    return res.status(403).json({ error: "Token does not exist" });
  }

  // evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || checkToken.rows[0].username !== decoded.username) {
      res.status(403).json({ error: "Invalid token" });
    }
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      accessToken: accessToken,
      user: decoded.username,
      id: checkToken.rows[0].id,
    });
  });
}

module.exports = refreshToken;
