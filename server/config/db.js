const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  host: process.env.DB_HOSTNAME || "localhost",
  port: 5432,
  database: process.env.DB || "twitter",
});

module.exports = {
  async query(text, params, callback) {
    return pool.query(text, params, callback);
  },
};
