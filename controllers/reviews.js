// Importing the necessary models for Restaurants and Reviews
const Restaurant = require("../models/restaurant");
const Review = require("../models/review");

// Function to handle creation of a new review for a restaurant
module.exports.createReview = async (req, res) => {
  // Extract restaurant id from the request parameters
  const { id } = req.params;

  // Fetch the restaurant by its id
  const restaurant = await Restaurant.findById(id);

  // Create a new review instance using the data received in the request body
  const review = new Review(req.body.review);

  // Set the author of the review to the currently logged-in user's id
  review.author = req.user._id;

  // Add the review to the restaurant's reviews array
  restaurant.reviews.push(review);

  // Save the review and the updated restaurant to the database
  await review.save();
  await restaurant.save();

  // Flash a success message and redirect to the restaurant's page
  req.flash("success", "Created a new review!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

// Function to handle deletion of a review
module.exports.deleteReview = async (req, res) => {
  // Extract the restaurant id and review id from the request parameters
  const { id, reviewId } = req.params;

  // Update the restaurant by removing the review reference from its reviews array
  await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review from the database
  await Review.findByIdAndDelete(reviewId);

  // Flash a success message and redirect back to the restaurant's page
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/restaurants/${id}`);
};
