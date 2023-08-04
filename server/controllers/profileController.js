const { query } = require("../config/db");

async function editProfile(req, res) {
  const { user, displayName, bio, location, website } = req.body;

  try {
    const editProfile = await query(
      "UPDATE users SET display_name=$1, bio=$2, location=$3, website=$4 WHERE username=$5",
      [displayName, bio, location, website, user]
    );

    return res.status(200).json({ message: "Profile updated!" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { editProfile };
