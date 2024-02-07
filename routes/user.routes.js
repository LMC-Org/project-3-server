const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    console.log(req.params);

    User.findById(id)
        .populate({
            path: "helpPosts",
            options: {sort: {"createdAt": -1}}
        })
        .then((user) => {
            const { tokens, helpPosts, _id, email, phone, name, profilePicture, testimonies, description, location, skills } = user;
            res.send({ tokens, helpPosts, _id, email, phone, name, profilePicture, testimonies, description, location, skills });
            // console.log(user)
        })
        .catch((err) => console.log(err))
});

router.put("/edituser",(req, res, next) => {

    const { location, profilePicture, skills, description, id } = req.body;
    User.findByIdAndUpdate(id, {
        location,
        profilePicture, 
        skills,
        description
        
    }, { new: true })
    .then((updatedUser) => {
        res.json(updatedUser)
        console.log("updateduser",updatedUser);
    })
    .catch((err) => (err))
});

router.post("/upload", fileUploader.single("profilePicture"), (req, res, next) => {

    // console.log("file is: ", req.file)
   
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    
    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
    
    res.json({ fileUrl: req.file.path });
  });

  router.get("/check-notifications/:userId", (req, res, next) => {
	const id = req.params.userId;
	let notificationsResponse = false;
    //console.log("check-notifications req.params: ",req.params, "id = ", id);
	User.findById(id, "hasNewNotifications")
		.then((response) => {
			//console.log("response: ", response);
			notificationsResponse = response.hasNewNotifications;
			res.send({hasNewNotifications: response.hasNewNotifications})})
		.catch((err) => res.status(500).send({error: err}));
  });

  router.get("/get-notifications/:userId", (req, res, next) => {
	const id = req.params.userId;
	User.findById(id, "notifications").populate({path: 'notifications.reference', model: 'HelpPost', select: ('title creator'), populate: {path: 'creator', select: 'name -_id'}})
		.then(response => {
			// console.log("get-notifications response: ", response);
			res.send(response.notifications)
		})
		.then(() => User.findByIdAndUpdate(id, {hasNewNotifications: false}))
		.catch((err) => res.status(500).send({error: err}));
  });

  router.patch("/notification-set-as-read", (req, res, next) => {
	const { userId, notifIndex } = req.body;
	console.log("set as read - req.body: ", req.body, userId, notifIndex);
	User.findByIdAndUpdate(userId, { $set : { [`notifications.${notifIndex}.isUnread`]: false }}, { new: true } )
	.then((updated) => {
		console.log("set as read return: ", updated );
		res.status(200).send("OK");
	})
	.catch(err => res.status(500).send(err));
  })

module.exports = router;
