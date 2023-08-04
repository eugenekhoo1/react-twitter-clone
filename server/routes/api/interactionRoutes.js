const express = require("express");
const router = express.Router();
const interactionController = require("../../controllers/interactionController");

router.post("/follow", interactionController.followUser);
router.post("/unfollow", interactionController.unfollowUser);
router.post("/like", interactionController.likeTweet);
router.post("/retweet", interactionController.retweet);

module.exports = router;
