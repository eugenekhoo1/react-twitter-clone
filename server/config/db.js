const Pool = require("pg").Pool;
require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.INTERNAL_DB_URL,
// });

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
});

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   port: 5000,
//   database: "twitter",
// })

module.exports = {
  async query(text, params, callback) {
    return pool.query(text, params, callback);
  },
};
