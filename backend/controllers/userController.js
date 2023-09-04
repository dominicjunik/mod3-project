const User = require('../models/userModel')

//set these up as arrow functions so the names can be protected classes like NEW

// index GET => display all users that exist
module.exports.index = async (req, res) => {
    console.log('GET => /api/users/')
    try {        
        const users = await User.find()
        console.log('Found users', users)
        res.json(users)
    } catch(error) {
        console.log(error.message)
        res.json({error: error.message})
    }
}


// update PUT => this route updates the user information
module.exports.update = async (req, res) => {
    console.log('PUT => /api/users/:id')
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        console.log('Found user', updatedUser)
        res.json(updatedUser)
    } catch(error) {
        console.log(error.message)
        res.json({error: error.message})
    }
}

// show GET => this route will display the profile information and allow it to be editted 
module.exports.show = async (req, res) => {
    console.log('GET => /api/users/')
    try {
        const user = await User.findById(req.id)
        console.log('Found user', user)
        res.json(user)
    } catch(error) {
        console.log(error.message)
        res.json({error: error.message})
    }
}

