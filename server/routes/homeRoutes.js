const express = require("express");
const router = express.Router();
const homeFeed = require("../controllers/homeController");

router.post("/", homeFeed);

module.exports = router;
