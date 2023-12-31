// Required modules and dependencies
const { restaurantSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Restaurant = require("./models/restaurant");
const Review = require("./models/review");

// Ensure user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;  // Store the original URL to redirect after login
    req.flash("error", "You Must Be Logged In!");
    return res.redirect("/login");
  }
  next();
};

// Store the URL to return to, if available
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// Validate the restaurant data against the schema
module.exports.validateRestaurant = (req, res, next) => {
  const { error } = restaurantSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Ensure user is the author of the restaurant
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  if (!restaurant.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to that!");
    return res.redirect(`/restaurants/${id}`);
  }
  next();
};

// Ensure user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to delete this review!");
    return res.redirect(`/restaurants/${id}`);
  }
  next();
};

// Validate the review data against the schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
