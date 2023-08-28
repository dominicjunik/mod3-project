const express = require('express')
const router = express.Router()

// import the controller here
const authController = require('../controllers/authController')

// Protected routes here

// create/register route POST => this route creates a user
router.post('/register', authController.register)

// login route POST => encrypts the password and sends a login attempt
router.post('/login', authController.login)

// delete route DELETE => this route deletes the user

module.exports = router