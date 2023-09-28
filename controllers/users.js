// Importing the user model
const User = require("../models/user");

// Function to render the user registration form
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// Function to handle user registration
module.exports.registerUser = async (req, res) => {
  try {
    // Extract email, username, and password from the request body
    const { email, username, password } = req.body;

    // Create a new user instance using the provided email and username
    const user = new User({ email, username });

    // Use the User model's `register` method to register the user with the provided password
    const registeredUser = await User.register(user, password);

    // Log in the newly registered user
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      // Flash a welcome message to the user and redirect to the restaurants page
      req.flash(
        "success",
        `Welcome to GourmetGuide, ${registeredUser.username}!`
      );
      res.redirect("/restaurants");
    });
  } catch (e) {
    // Flash any error messages and redirect back to the registration form
    req.flash("error", e.message);
  }
};

// Function to render the user login form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// Function to handle user login
module.exports.loginUser = (req, res) => {
  // Flash a welcome back message to the user
  req.flash("success", `Welcome Back, ${req.user.username}!`);

  // Redirect the user to their intended page or to the restaurants page if no intended page is set
  const redirectUrl = res.locals.returnTo || "/restaurants";
  res.redirect(redirectUrl);
};

// Function to handle user logout
module.exports.logoutUser = (req, res, next) => {
  // Use the `logout` method provided by Passport.js to log out the user
  req.logout(function (err) {
    if (err) {
      // If there's an error during logout, handle it
      return next(err);
    }

    // Flash a goodbye message and redirect to the restaurants page
    req.flash("success", "Goodbye!");
    res.redirect("/restaurants");
  });
};
