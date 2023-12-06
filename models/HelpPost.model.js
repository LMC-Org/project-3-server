const { Schema, model } = require("mongoose");

const helpPostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required."],
        },
        location: {
            type: String,
            required: [true, "Location is required."],
        },
        description: {
            type: String,
            required: [true, "Description is required."],
        },
        helpImageUrl: {
            type: String,
            default: "/images/help-default.jpg"
        },
        creator:  {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        volunteers: {
            type: [{type: Schema.Types.ObjectId, ref: "User"}]
        },        
        selectedVolunteer:  {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
    timestamps: true,
  }
);

const HelpPost = model("HelpPost", helpPostSchema);
module.exports = HelpPost;