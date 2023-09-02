// import the models for the posts
const Posts = require('../models/postModel')
// might need the user model as well
const User = require('../models/userModel')
// import the seed data
const posts = require('../models/posts')

// seed route
module.exports.seed = async (req, res) => {
    try {
        await Posts.deleteMany({})
        await Posts.create(posts)
        res.status(200).json({message: 'seeded database'})

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

// index GET => display all posts
module.exports.index = async (req, res) => {
    try {
        // get all the posts and sort by likes
        const posts = await Posts.find().sort({ candyPoints: -1 })
        // send them out
        res.status(200).json(posts)
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}
// delete DELETE => delete a single post
module.exports.delete = async (req, res) => {
    try {
        // use params to get post id
        const post = await Posts.findByIdAndDelete(req.params.id)
        // next we need to remove the id from the myPosts array in the user req.id or req.username
        await User.findByIdAndUpdate(req.id, {
            $pull: {
                myPosts: post._id
            }
        })
        res.status(200).json({message: "post deleted"})
       
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}
// bet PUT => a user makes a wager on a post
// update the post to store that they have made this wager
// update the user with the winnings or losings
// update the post creator with their winnings if the user guessed wrong
module.exports.bet = async (req, res) => {
    // req.body = { updatedUser, updatedPost, correct}
    // we make an update to the post saving all that data
    // we make an update to the user saving all that data
    // if the guess is wrong we pay out the post creator
    try {
        // find the post by the ID param and update with the req.body {new: true} returns the updated post in the variable
        const updatedPost = await Posts.findByIdAndUpdate(req.params.id, req.body.updatedPost, { new: true })
        // res.status(200).json(updatedPost)
        // find the user by ID
        const updatedUser = await User.findByIdAndUpdate(req.body.updatedUser._id, req.body.updatedUser, { new: true })
        // res.status(200).json(updatedUser)
        // if the guess was not correct, find the post creator by name and update them with points
        let updatedPostCreator
        if (!req.body.correct) {
            let query = {username: req.body.updatedPost.createdBy}
            updatedPostCreator = await User.findOneAndUpdate(query, { $inc: {candyPoints: req.body.updatedPost.candyPoints} })
            
        }
        res.status(200).json(updatedPostCreator, updatedUser, updatedPost)
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}
// update PUT => edit a single post
module.exports.update = async (req, res) => {
    try {
        // find the post by the ID param and update with the req.body {new: true} returns the updated post in the variable
        const updatedPost = await Posts.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedPost)
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

// create POST => create a new post
module.exports.create = async (req, res) => {
    try {
        //create a new post with the form data from body
        const post = await Posts.create(req.body)
        console.log(req.body.candyPoints)
        // attach the post to the user that created it
        await User.findByIdAndUpdate(req.id, {
            $push: {
                myPosts: post._id
            },
            $inc: {
                candyPoints: (-req.body.candyPoints)
            }
        })
        res.status(200).json(post)
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}
// show GET => show a single post 
module.exports.show = async (req, res) => {
    try {
        // find the post and send it back
        const post = await Posts.findById(req.params.id)
        if(post) {
            res.status(200).json(post)
        } else {
            res.status(400).json({message: 'post does not exist'})
        }
        
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}