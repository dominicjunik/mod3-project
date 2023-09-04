const express = require("express");
const router = express.Router();

// import the controller here
const authController = require("../controllers/authController");
// import middleware to authorize routes that should only work if you are logged in
const { authorize } = require("../middleware/authMiddleware");

// Protected routes here
// create/register route POST => this route creates a user
router.post("/register", authController.register);

// login route POST => encrypts the password and sends a login attempt
router.post("/login", authController.login);

// delete route DELETE => this route deletes the user
router.delete("/:id", authController.delete);

//update route for users editing their information
router.put("/:id", authorize, authController.update);

module.exports = router;
