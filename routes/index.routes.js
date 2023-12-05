const express = require("express");
const router = express.Router();
//
const mongoose = require("mongoose");
const HelpPost = require("../models/HelpPost.model");


// api/home
// finds and responds with all HelpPost documents in the DB with isCompleted: false and sorted from newest to oldest
router.get("/home", (req, res, next) => {
	filter = {
		'isCompleted': false
	};
	const sort = {
		'createdAt': -1
	};

	HelpPost.find(filter).sort(sort)
		.populate("creator")
		.then((allPosts) => res.json(allPosts));
});

module.exports = router;

