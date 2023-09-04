const express = require("express");
const router = express.Router();

// import the controller here
const userController = require("../controllers/userController");

// set routes here
// NORMAL ROUTES
// index route GET => this route displays all users
router.get("/list", userController.index);
// show route  GET => this route will display the profile information and allow it to be editted
// the authMiddleware attaches the userID to req.id so we dont need a param for this
router.get("/", userController.show);
// update route PUT => this route will update the profile information after form submission
router.put("/:id", userController.update);

// authRoutes is the other half of the user routes
// register, login, and delete

module.exports = router;
