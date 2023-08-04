const { query } = require("../config/db");

async function logoutUser(req, res) {
  // Delete accessToken on client side once logged out
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("no cookies");
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  // Check if refreshtoken is in db

  const checkToken = await query("SELECT * FROM users WHERE refreshtoken=$1", [
    refreshToken,
  ]);

  // Refresh token not in database; Delete cookies
  if (checkToken.rowCount === 0) {
    console.log("no refresh tokens");
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Refresh token in database; delete refresh token and cookies
  if (checkToken.rows[0].refreshtoken === refreshToken) {
    console.log("refresh token found");
    await query("UPDATE users SET refreshtoken = NULL WHERE refreshtoken=$1", [
      refreshToken,
    ]);
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    }); // in production, add secure: true - only serves on https
    return res.sendStatus(204);
  }
}

module.exports = logoutUser;
