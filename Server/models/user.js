const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    expireToken: Date,
    pic: {
        type: String,
        default: "https://res.cloudinary.com/instagram-clone2001/image/upload/v1625502160/User-Profile-PNG-High-Quality-Image_ukcaxe.png"
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }]
})

mongoose.model("User", userSchema);