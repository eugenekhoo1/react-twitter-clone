const Pool = require("pg").Pool;
require("dotenv").config();

// Localhost testing

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   port: 5000,
//   database: "twitter",
// });

const pool = new Pool({
  connectionString: process.env.EXTERNAL_BASE_URL,
});

module.exports = {
  async query(text, params, callback) {
    return pool.query(text, params, callback);
  },
};
