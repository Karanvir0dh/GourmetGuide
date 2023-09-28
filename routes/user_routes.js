// Required dependencies and modules
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

// Define routes for user registration

// GET route to render the registration form and POST route to handle user registration
router
  .route("/register")
  .get(users.renderRegister)          // Display registration form
  .post(catchAsync(users.registerUser));  // Process registration data

// Define routes for user login

// GET route to render the login form
// POST route uses passport for authentication and a middleware to store the return URL if any
router
  .route("/login")
  .get(users.renderLogin)             // Display login form
  .post(
    storeReturnTo,
    passport.authenticate("local", {   // Authenticate user
      failureFlash: true,              // Flash message on failure
      failureRedirect: "/login",       // Redirect if authentication fails
    }),
    users.loginUser                   // Log the user in if authenticated
  );

// Define route for user logout
router.get("/logout", users.logoutUser); // Handle user logout

// Export the router for use in the app
module.exports = router;
