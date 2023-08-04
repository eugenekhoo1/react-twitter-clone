const { query } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function createUser(req, res) {
  console.log("Server: Creating account...");
  const { user, pwd } = req.body;
  const pwdSalt = await bcrypt.genSalt(10);
  const pwdHash = await bcrypt.hash(pwd, pwdSalt);

  try {
    const checkUser = await query("SELECT * FROM users WHERE username=$1", [
      user,
    ]);

    if (checkUser.rowCount > 0) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const newUser = await query(
      "INSERT INTO users (username, pwdhash, pwdsalt) VALUES($1, $2, $3)",
      [user, pwdHash, pwdSalt]
    );

    return res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.error("Error during user creation:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = createUser;
