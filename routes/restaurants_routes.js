const express = require("express");
const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", { restaurants });
  })
);

router.get("/new", async (req, res) => {
  res.render("restaurants/new");
});

router.post(
  "/",
  validateRestaurant,
  catchAsync(async (req, res) => {
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/${restaurant._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate("reviews");
    res.render("restaurants/show", { restaurant });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    res.render("restaurants/edit", { restaurant });
  })
);

router.put(
  "/:id",
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
    res.redirect(`/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("");
  })
);

module.exports = router;
