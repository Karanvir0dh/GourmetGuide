const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateRestaurant } = require("../middleware");
const restaurants = require("../controllers/restaurants");

router.get("/", catchAsync(restaurants.index));

router.get("/new", isLoggedIn, restaurants.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateRestaurant,
  catchAsync(restaurants.createRestaurant)
);

router.get("/:id", catchAsync(restaurants.showRestaurant));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(restaurants.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateRestaurant,
  catchAsync(restaurants.editRestaurant)
);

router.delete("/:id", isLoggedIn, catchAsync(restaurants.deleteRestaurant));

module.exports = router;
