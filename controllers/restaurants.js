// Importing necessary modules and configurations
const Restaurant = require("../models/restaurant");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Display all restaurants
module.exports.index = async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.render("restaurants/index", { restaurants });
};

// Render the form for adding a new restaurant
module.exports.renderNewForm = (req, res) => {
  res.render("restaurants/new");
};

// Handle the creation of a new restaurant
module.exports.createRestaurant = async (req, res) => {
  // Get geoData for the location using MapBox
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.restaurant.location,
      limit: 1,
    })
    .send();

  // Create new restaurant with form data and geoData
  const restaurant = new Restaurant(req.body.restaurant);
  restaurant.geometry = geoData.body.features[0].geometry;
  restaurant.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  restaurant.author = req.user._id;
  await restaurant.save();
  req.flash("success", "Successfully made a new restaurant!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

// Show a particular restaurant details
module.exports.showRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  
  if (!restaurant) {
    req.flash("error", " Cannot find that restaurant!");
    return res.redirect("/restaurants");
  }
  res.render("restaurants/show", { restaurant });
};

// Render the form to edit an existing restaurant
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  
  if (!restaurant) {
    req.flash("error", " Cannot find that restaurant!");
    return res.redirect("/restaurants");
  }
  
  res.render("restaurants/edit", { restaurant });
};

// Handle the updating of a restaurant
module.exports.editRestaurant = async (req, res) => {
  const { id } = req.params;
  
  // Update restaurant details
  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    {
      ...req.body.restaurant,
    },
    { new: true }
  );

  // Add new images
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  restaurant.images.push(...imgs);
  await restaurant.save();

  // Delete images if any are marked for deletion
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await restaurant.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Successfully updated the restaurant!");
  res.redirect(`/restaurants/${id}`);
};

// Handle the deletion of a restaurant
module.exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  await Restaurant.findByIdAndDelete(id);
  res.redirect("/restaurants");
};
