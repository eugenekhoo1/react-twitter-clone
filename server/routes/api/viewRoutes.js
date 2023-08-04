const express = require("express");
const router = express.Router();
const viewController = require("../../controllers/viewController");

router.get("/likesarray/:user", viewController.likesArray);
router.get("/likedtweets/:user", viewController.likedTweets);
router.get("/retweetedtweets/:user", viewController.retweetedTweets);
router.get("/tweets/:user", viewController.userTweets);
router.get("/profile/:user", viewController.getProfile);
router.get("/tweet/:tid", viewController.getTweet);
router.get("/replies/:tid", viewController.getReplies);

module.exports = router;
