const express = require("express");
const router = express.Router();
const HelpPost = require("../models/HelpPost.model");
const User = require("../models/User.model");
const fileUploader = require('../config/cloudinary.config');

const CAT_NEW_VOLUNTEER = 1;
const CAT_VOLUNTEER_SELECTED = 2;
const CAT_NEW_TOKEN = 3;

// ROUTES START WITH "/help-post"

// This fn adds Notification to specified user in our DB.
//the $position: 0 puts the new item on top of array. It must come with $each.
const addNotification = async (userId, notificationCategory, refPostId) => {
	return (await User.findByIdAndUpdate(userId, {
		$push: {
			notifications: {
				$each: [{ category: notificationCategory, reference: refPostId }],
				$position: 0
			}
		},
		hasNewNotifications: true
	}, {new: true}));
}

router.post("/addvolunteer", (req, res, next) => {
    const { volunteerId, postId, creatorId } = req.body;

	// {new:true} returns the updated document, not the version before update.
    HelpPost.findByIdAndUpdate(postId, { $push: { volunteers: volunteerId } }, { new: true })
        .then((data) => {
			console.log("/addvolunteer: ", data);
			return (addNotification(creatorId, CAT_NEW_VOLUNTEER, postId));
			})
			.then(data => {
				console.log("/addvolunteer: ", data);
				res.send({ message: "Thank you for volunteering, the user has to contact you now" })
		})
        .catch((err) => res.send({ message: "some error ocurred, sorry" }));
});

router.post("/selectvolunteer", (req, res, next) => {
    const { volunteerId, postId } = req.body;

    HelpPost.findByIdAndUpdate(postId, { $pull: { volunteers: volunteerId }, $set: { selectedVolunteer: volunteerId } }, { new: true })
        .then(() => {
			return (addNotification(volunteerId, CAT_VOLUNTEER_SELECTED, postId)); 		
		})
		.then(() => res.send({ message: "Volunteer successfuly selected." }))
        .catch((err) => res.send({ message: "an error ocurred, sorry" }));
});

router.get("/:helpId", (req, res, next) => {
    const { helpId } = req.params
    HelpPost.findById(helpId)
        .populate("creator")
        .populate("selectedVolunteer")
        .populate("volunteers")
        .then((foundHelpPost) => {
            const { title, volunteers, description, location, creator, helpImageUrl } = foundHelpPost
            res.send({ foundHelpPost })
        })
        .catch((err) => ("couldn't find help post", err))
});

//gets all help posts that have my id in volunteers or selected volunteers
router.get("/volunteered/:userId", (req, res, next) => {
    const userId = req.params.userId;
    let allHelpPostsIVolunteered;

    //console.log('este es el id',req.params.userId);
    HelpPost.find({ volunteers: userId })
        .then((result) => {
            allHelpPostsIVolunteered = result;
            //console.log('ESTE ES EL allHelpPostsIVolunteered', allHelpPostsIVolunteered)
            return HelpPost.find({ selectedVolunteer: userId });
        })
        .then((allHelpPostsIWasChosen) => {
            //console.log('ESTE ES EL allHelpPostsIWasChosen', allHelpPostsIWasChosen)
            res.send({ allHelpPostsIVolunteered, allHelpPostsIWasChosen })
        })
        .catch((err) => ("couldn't find help post", err))
});

router.post("/createhelp", (req, res, next) => {
    const { title, location, description, helpImageUrl, creator, category } = req.body;
    let newPost = null;
    //console.log("reqbody", req.body);
    // First, update the user
    User.findByIdAndUpdate(creator,
        {
            $inc: { tokens: - 1 }
        },
        { new: true })
        .then(updatedUser => {
            // Check if the user update was successful
            if (!updatedUser) {
                res.status(500).send("There was an error updating the user")
                return Promise.reject('User update failed');
            }

            // If the user update was successful, create the help post
            return HelpPost.create({
                title,
                location,
                description,
                helpImageUrl,
                creator,
                category
            });
        })
        .then(createdHelp => {
            // Send the created help post as a response
            return User.findByIdAndUpdate(creator, {$push: { helpPosts: createdHelp._id }}, { new: true })
            .then((createdHelp)=>{

                res.json(createdHelp);
            })
        })
        .catch(error => {
            // Handle any errors
            next(error);
        });
});
/* router.post("/createhelp", (req, res, next) => {
    const { title, location, description, helpImageUrl, creator, category } = req.body;
    let newPost = null;
    //console.log("reqbody", req.body);
    HelpPost.create({
        title,
        location,
        description,
        helpImageUrl,
        creator,
        category
    })
        .then((createdHelp) => {
            newPost = createdHelp;
            res.json(createdHelp);
            //console.log(createdHelp);
            //console.log("este es el req", createdHelp);
        })
        .then(() => {
            //console.log("NEWPOST ID: ", newPost);
            return User.findByIdAndUpdate(creator, { $push: { helpPosts: newPost._id }, $inc: { tokens: - 1 } }, { new: true })
                // this mongoose query $inc increments specified field by specified value (in this case increments by -1)
                .then((res) => console.log("Updated user: ", res.helpPosts))
                .catch((err) => (err))
        })
        .catch((err) => ("couldn't create help post", err))
}); */

router.post("/upload", fileUploader.single("helpImageUrl"), (req, res, next) => {
    console.log("file is: ", req.file)

    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }

    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

    res.json({ fileUrl: req.file.path });
});

router.put("/edithelp/:helpId", (req, res, next) => {
    const { helpId } = req.params
    const { title, location, description, helpImageUrl, selectedVolunteer, category } = req.body;
    console.log(req.body, req.params);

    HelpPost.findByIdAndUpdate(helpId, {
        $set: {
            title,
            location,
            description,
            helpImageUrl,
            selectedVolunteer,
            category
        }
    })
        .then((updatedHelp) => {
            res.json(updatedHelp)
            console.log("UPDATE", updatedHelp);
        })
        .catch((err) => console.log(err))
});

router.put("/setcompleted", (req, res, next) => {
    const { volunteerId, postId } = req.body;
    console.log("SETCOMPLETED: volunteerID postId: ", volunteerId, postId);
    HelpPost.findByIdAndUpdate(postId, { $set: { isCompleted: true } })
        .then(() => User.findByIdAndUpdate(volunteerId, { $inc: { tokens: 1 } }, { new: true }))
		.then(() => addNotification(volunteerId, CAT_NEW_TOKEN, postId))
        .then((foundUser) => console.log("foundUser: ", foundUser))
        .then(() => res.send({ message: "Successfully completed!" }))
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Sorry, an error ocurred." });
        })
});

router.delete("/edithelp/:helpId", (req, res, next) => {
    const { helpId } = req.params
    HelpPost.findByIdAndDelete(helpId)
        .then((deletedHelp) => {
            console.log("Help deleted:", deletedHelp)
            res.send({ message: "help deleted successfully" });

        })
})




module.exports = router;
