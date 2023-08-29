// import the models for the posts
const Posts = require('../models/postModel')
// might need the user model as well
const User = require('../models/userModel')

// seed route 
// index GET => display all posts
module.exports.index = async (req, res) => {
    try {
        // get all the posts and sort by likes
        const posts = await Posts.find().sort({ likes: 1 })
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
        // attach the post to the user that created it
        await User.findByIdAndUpdate(req.id, {
            $push: {
                myPosts: post._id
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
        res.status(200).json(post)
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}