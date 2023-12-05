const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
// const fileUploader = require("../config/cloudinary.config");

router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    console.log(req.params);

    User.findById(id)
        .populate("helpPosts")
        .then((user) => {
            const { tokens, helpPosts, _id, email, phone, name, profilePicture, testimonies, description, location, skills } = user;
            res.send({ tokens, helpPosts, _id, email, phone, name, profilePicture, testimonies, description, location, skills });
            // console.log(user)
        })
        .catch((err) => console.log(err))
});


router.put("/edituser",(req, res, next) => {

    const { location, profilePicture, skills, description, id } = req.body;
    User.findByIdAndUpdate(id, {$set:{
        location,
        profilePicture, 
        skills,
        description
        }
    })
    .then((updatedUser) => {
        res.json(updatedUser)
        console.log("updateduser",updatedUser);
    })
    .catch((err) => (err))
});

module.exports = router;
