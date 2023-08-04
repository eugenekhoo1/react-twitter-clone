const express = require("express");
const router = express.Router();
const tweetController = require("../../controllers/tweetController");

router.post("/create", tweetController.createTweet);
router.post("/reply", tweetController.replyTweet);
router.post("/edit", tweetController.editTweet);
router.post("/delete", tweetController.deleteTweet);

module.exports = router;
