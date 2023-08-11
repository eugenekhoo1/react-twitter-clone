const { query } = require("../config/db");

async function searchProfiles(req, res) {
  try {
    const response = await query(
      "SELECT id, username, display_name FROM users"
    );
    return res.status(200).send(response.rows);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  searchProfiles,
};
