// Import necessary modules from mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for reviews
const reviewSchema = new Schema({
  // The main content of the review
  body: String,

  // The rating associated with the review, typically on a scale (e.g., 1-5)
  rating: Number,

  // Reference to the user who wrote the review
  author: {
    type: Schema.Types.ObjectId,  // The author is referenced by their unique ID in the User model
    ref: "User",                 // This establishes a relationship between Review and User
  },
});

// Export the Review model based on the defined schema
module.exports = mongoose.model("Review", reviewSchema);
