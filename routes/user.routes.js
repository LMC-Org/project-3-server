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

router.post("/upload", fileUploader.single("profilePicture"), (req, res, next) => {
    console.log("file is: ", req.file)

   if (!req.file) {
       next(new Error("No file uploaded!"));
       return;
   }

   // Get the URL of the uploaded file and send it as a response.
   // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

   res.json({ fileUrl: req.file.path });
});

module.exports = router;
