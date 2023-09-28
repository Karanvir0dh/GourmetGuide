// Required dependencies and modules
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateRestaurant } = require("../middleware");
const restaurants = require("../controllers/restaurants");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Define routes for restaurants

// Route for listing all restaurants and for creating a new restaurant
router
  .route("/")
  // GET: Fetch all restaurants
  .get(catchAsync(restaurants.index))
  // POST: Add a new restaurant (with image upload & validation)
  .post(
    isLoggedIn, // Ensure user is logged in
    upload.array("image"), // Allow multiple image uploads
    validateRestaurant, // Validate the restaurant details
    catchAsync(restaurants.createRestaurant) // Create a new restaurant
  );

// Route for displaying the form to create a new restaurant
router.get("/new", isLoggedIn, restaurants.renderNewForm); // Ensure user is logged in

// Routes to get, update, and delete a specific restaurant by its ID
router
  .route("/:id")
  // GET: Fetch details of a specific restaurant
  .get(catchAsync(restaurants.showRestaurant))
  // PUT: Update a specific restaurant (with image upload & validation)
  .put(
    isLoggedIn, // Ensure user is logged in
    isAuthor, // Ensure user is the author of the restaurant
    upload.array("image"), // Allow multiple image uploads
    validateRestaurant, // Validate the updated restaurant details
    catchAsync(restaurants.editRestaurant) // Edit the restaurant details
  )
  // DELETE: Remove a specific restaurant
  .delete(isLoggedIn, catchAsync(restaurants.deleteRestaurant)); // Ensure user is logged in

// Route for displaying the form to edit a specific restaurant
router.get(
  "/:id/edit",
  isLoggedIn, // Ensure user is logged in
  isAuthor, // Ensure user is the author of the restaurant
  catchAsync(restaurants.renderEditForm) // Render the form for editing
);

// Export the router to be used in other parts of the app
module.exports = router;
