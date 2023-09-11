const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
// const User = require("./user");

const RestaurantSchema = new Schema({
  title: String,
  image: String,
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
});

RestaurantSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
