const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/searchController");

router.get("/profiles", searchController.searchProfiles);

module.exports = router;
