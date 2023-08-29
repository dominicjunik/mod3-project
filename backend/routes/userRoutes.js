const express = require('express')
const router = express.Router()

// import the controller here
const userController = require('../controllers/userController')

// set routes here
// NORMAL ROUTES
// index route GET => this route displays all users 
router.get('/', userController.index)
// show route  GET => this route will display the profile information and allow it to be editted 
router.get('/:id', userController.show)

// AUTH ROUTES these will be moved later
// register, login, and delete moved to auth routes


// update route PUT => this route will update the profile information after form submission
router.put('/:id', userController.update)


module.exports = router