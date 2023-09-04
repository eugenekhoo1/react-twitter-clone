const express = require("express");
const router = express.Router();
const avatarUpload = require("../../controllers/imageController");

router.post("/avatar", avatarUpload);

module.exports = router;
