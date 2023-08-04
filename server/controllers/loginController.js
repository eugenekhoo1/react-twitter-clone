const { query } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function loginUser(req, res) {
  const { user, pwd } = req.body;
  console.log(user, pwd);

  try {
    const checkUser = await query("SELECT * FROM users WHERE username=$1", [
      user,
    ]);

    if (checkUser.rowCount === 0) {
      return res.status(400).json({ error: "Username does not exist" });
    }

    const id = checkUser.rows[0].id;

    bcrypt.compare(pwd, checkUser.rows[0].pwdhash, async (err, result) => {
      if (result) {
        // Generate JWT
        const accessToken = jwt.sign(
          {
            username: checkUser.rows[0].username,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          {
            username: checkUser.rows[0].username,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        // save refreshtoken in DB
        const addRefreshToken = await query(
          "UPDATE users SET refreshtoken=$1 WHERE username=$2",
          [refreshToken, user]
        );
        console.log(addRefreshToken);

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000, // h * mins * seconds * milliseconds (1 day),
        });
        return res.status(200).json({ accessToken, id });
      } else {
        return res
          .status(401)
          .json({ error: "Incorrect username and password combination" });
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = loginUser;
