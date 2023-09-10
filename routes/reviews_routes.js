const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

const { reviewSchema } = require("../schemas");

const Restaurant = require("../models/restaurant");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash("success", "Created a new review!");
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/restaurants/${id}`);
  })
);

module.exports = router;
