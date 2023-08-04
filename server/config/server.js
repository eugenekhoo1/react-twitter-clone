require("dotenv").config();

module.exports = { PORT: process.env.DB_PORT || 5000 };
