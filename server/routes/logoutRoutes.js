const express = require("express");
const router = express.Router();
const logoutUser = require("../controllers/logoutController");

router.get("/", logoutUser);

module.exports = router;
