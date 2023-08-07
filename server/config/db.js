const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  host: process.env.DB_HOSTNAME || "localhost",
  port: process.env.DB_PORT || 5000,
  database: process.env.DB || "twitter",
  password: process.env.DB_PASSWORD || "",
});

module.exports = {
  async query(text, params, callback) {
    return pool.query(text, params, callback);
  },
};
