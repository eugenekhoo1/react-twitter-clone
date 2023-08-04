const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "twitter",
});

module.exports = {
  async query(text, params, callback) {
    return pool.query(text, params, callback);
  },
};
