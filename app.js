const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { restaurantSchema, reviewSchema } = require("./schemas");
const Restaurant = require("./models/restaurant");
const Review = require("./models/review");
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
const restaurantsRoutes = require("./routes/restaurants_routes");
const reviewsRoutes = require("./routes/reviews_routes");

mongoose
  .connect("mongodb://127.0.0.1:27017/Gourmet-Guide")
  .then(() => {
    console.log("Mongo CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("Mongo ERROR!!!!");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use(morgan("tiny"));

const validateRestaurant = (req, res, next) => {
  const { error } = restaurantSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/restaurants",
  catchAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
  })
);

app.get("/restaurants/new", async (req, res) => {
  res.render("restaurants/new");
});

app.post(
  "/restaurants",
  validateRestaurant,
  catchAsync(async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

app.get(
  "/restaurants/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate("reviews");
    res.render("restaurants/show", { restaurant });
  })
);

app.get(
  "/restaurants/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render("restaurants/edit", { restaurant });
  })
);

app.put(
  "/restaurants/:id",
  validateRestaurant,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        ...req.body.restaurant,
      },
      { new: true }
    );
    res.redirect(`/restaurants/${id}`);
  })
);

app.delete(
  "/restaurants/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("/restaurants");
  })
);

app.post(
  "/restaurants/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

app.delete(
  "/restaurants/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.msg) {
    err.msg = "Something went Wrong";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("on PORT 3000");
});
