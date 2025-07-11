const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    display_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    friendsList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users",
        default: [],
    },
    friendRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users",
        default: [],
    },
});

const User = new mongoose.model("User", UserSchema)

module.exports = { User }