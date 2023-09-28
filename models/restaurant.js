// Import necessary modules from mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import the review model for cleanup post restaurant deletion
const Review = require("./review");

// Define a schema for images associated with restaurants
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// A virtual property to get a thumbnail version of the image from Cloudinary
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// Options for the restaurant schema, ensuring that virtuals are included when converting the document to JSON
const opts = { toJSON: { virtuals: true } };

// Define the main restaurant schema
const RestaurantSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    priceRange: String,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// A virtual property to generate a popup markup for displaying restaurants on a map
RestaurantSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/restaurants/${this._id}">${this.title}</a><strong>
    <p>${this.location}</p>`;
});

// Middleware that runs after a restaurant is deleted, it cleans up associated reviews and images from Cloudinary
RestaurantSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Delete associated reviews
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });

    // Delete associated images from Cloudinary
    if (doc.images) {
      for (const img of doc.images) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }
  }
});

// Export the Restaurant model
module.exports = mongoose.model("Restaurant", RestaurantSchema);
