const express = require("express");
const router = express.Router();

router.post(
  "/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/${restaurant._id}`);
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/${id}`);
  })
);

module.exports = router;
