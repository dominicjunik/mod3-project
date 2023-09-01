const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
        },
        candyPoints: {
            type: Number,
            default: 100,
        },
        myPosts: [
            {
                type: mongoose.Types.ObjectId,
                // look for this in the posts collection
                ref: "posts",
            },
        ],
        solvedPosts: [
            {
                id: {
                    type: mongoose.Types.ObjectId,
                },
                trick: {
                    type: Boolean,
                },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
