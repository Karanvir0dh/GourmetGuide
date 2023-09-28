// Required dependencies and modules
const express = require("express");
// Create a new router with the option to merge parameters across route files
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/CatchAsync");
const Restaurant = require("../models/restaurant");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

// Define routes for reviews

// POST route to create a review
// Ensure user is logged in, validate the review content, then create the review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE route to remove a specific review by its ID
// Ensure user is logged in, validate user is the author of the review, then delete the review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// Export the router for use in the app
module.exports = router;
