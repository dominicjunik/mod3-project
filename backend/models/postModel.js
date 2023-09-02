const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    // not sure if this is the right data type,
    // but i want to be able to display the information about the user that created the post
    createdBy: { type: String },
    teaser: { 
        type: String,
        required: true
    },
    correctGuess: {
        type: String,
        required: true
    },
    wrongGuess: {
        type: String,
        required: true
    },
    trick: {
        type: Boolean,
        required: true
    },
    candyPoints: {
        type: Number,
        required: true
    },
    // not sure the best way to store likes and dislikes but i will start with just numbers
    likes: { type: Number, default: 0 },
    dislikes: {type: Number, default: 0},
    // the 
    solvedBy: [{
        username: {
            type: String
        },
        trick: {
            type: Boolean
        },
        correct: {
            type: Boolean
        }
    }]

}, { timestamps: true })

const Post = mongoose.model('posts', postSchema)

module.exports = Post