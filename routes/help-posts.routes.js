const express = require("express");
const router = express.Router();
const HelpPost = require("../models/HelpPost.model");

router.get("/:helpId", (req, res, next) => {

    const {helpId} = req.params

    HelpPost.findById(helpId)
    
        .populate("creator")
        .then((foundHelpPost) => {
            const {title, volunteers, description,location,category, creator, helpImageUrl } = foundHelpPost
            res.send({foundHelpPost})
        })
        .catch((err)=> console.log("couldn't find help post", err))
});

router.post("/createhelp", (req, res, next) => {
   
    const { title, location, description, helpImageUrl, creator, category} = req.body;
    console.log("reqbody", req.body);
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
        console.log(createdHelp);
        console.log("este es el req",createdHelp);
        })
        .catch((err)=>(err))
});

router.put("/edithelp/:helpId", (req, res, next) => {
    const {helpId} = req.params
    const { title, location,description, helpImageUrl, category,selectedVolunteer,isCompleted, id } = req.body;

    HelpPost.findByIdAndUpdate(id, {$set:{
        title, 
        location,
        description, 
        helpImageUrl, 
        category,
        selectedVolunteer,
        isCompleted,
        }
    })
    .then((updatedHelp) => {
        res.json(updatedHelp)
        console.log(updatedHelp);
    })
    .catch((err) => (err))
});

module.exports = router;
