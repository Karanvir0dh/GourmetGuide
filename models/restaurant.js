const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { cloudinary } = require("../cloudinary");

// https://res.cloudinary.com/dgegokbk6/image/upload/v1694639697/GourmetGuide/hgpveqjs0xul4vl0robc.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const RestaurantSchema = new Schema({
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
});

RestaurantSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
    if (doc.images) {
      for (const img of doc.images) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }
  }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
