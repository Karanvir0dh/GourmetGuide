const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const { isLoggedIn, isAuthor, validateRestaurant } = require("../middleware");
const restaurants = require("../controllers/restaurants");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(restaurants.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateRestaurant,
    catchAsync(restaurants.createRestaurant)
  );

router.get("/new", isLoggedIn, restaurants.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(restaurants.showRestaurant))
  .put(
    isLoggedIn,
    isAuthor,
    validateRestaurant,
    catchAsync(restaurants.editRestaurant)
  )
  .delete(isLoggedIn, catchAsync(restaurants.deleteRestaurant));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(restaurants.renderEditForm)
);

module.exports = router;
