const express = require("express");
const router = express.Router();
const HelpPost = require("../models/HelpPost.model");

router.get("/:helpId", (req, res, next) => {
    const { helpId } = req.params
    HelpPost.findById(helpId)
        .populate("creator")
        .populate("selectedVolunteer")
        .populate("volunteers")
        .then((helpPost) => {
            const { title, volunteers, description, location, category, creator } = helpPost
            res.send({ title, volunteers, description, location, category, creator })
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
            allHelpPostsIVolunteered= result;
            //console.log('ESTE ES EL allHelpPostsIVolunteered', allHelpPostsIVolunteered)
            return HelpPost.find({ selectedVolunteer: userId });
        })
        .then((allHelpPostsIWasChosen)=>{
            //console.log('ESTE ES EL allHelpPostsIWasChosen', allHelpPostsIWasChosen)
            res.send({ allHelpPostsIVolunteered, allHelpPostsIWasChosen })
        })
        .catch((err) => ("couldn't find help post", err))
});

router.post("/createhelp", (req, res, next) => {

    const { title, location, description, helpImageUrl, creator, category } = req.body;
    //console.log("reqbody", req.body);
    HelpPost.create({
        title,
        location,
        description,
        helpImageUrl,
        creator,
        category,

    })
        .then((createdHelp) => {
            res.json(createdHelp)
            //console.log(createdHelp);
            //console.log("este es el req", createdHelp);
        })
        .catch((err) => (err))
});

module.exports = router;
