const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");


router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    console.log(req.params);

    User.findById(id)
        .populate("helpPosts")
        .then((user) => {
            const { tokens, helpPosts, _id, email, name, profilePicture, testimonies, description, location, skills } = user;
            res.send({ tokens, helpPosts, _id, email, name, profilePicture, testimonies, description, location, skills });
            // console.log(user)
        })
        .catch((err) => console.log(err))
});

router.put("/edituser",fileUploader.single("profilePicture") ,(req, res, next) => {
    const { location, profilePicture, skills, description, id } = req.body;
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
      }
    User.findByIdAndUpdate(id, {$set:{
        location,
        profilePicture: req.file,
        skills,
        description,
        }
    })
    .then((updatedUser) => {
        res.json(updatedUser)
        console.log(updatedUser);
    })
    .catch((err) => (err))
});

module.exports = router;
