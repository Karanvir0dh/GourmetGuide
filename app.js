const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
const methodOverride = require("method-override");
const app = express();
const path = require("path");

mongoose
  .connect("mongodb://127.0.0.1:27017/Gourmet-Guide")
  .then(() => {
    console.log("Mongo CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("Mongo ERROR!!!!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.render("restaurants/index", { restaurants });
});

app.get("/restaurants/new", async (req, res) => {
  res.render("restaurants/new");
});

app.post("/restaurants", async (req, res) => {
  const restaurant = new Restaurant(req.body.restaurant);
  await restaurant.save();
  res.redirect(`/restaurants/${restaurant._id}`);
});

app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  res.render("restaurants/show", { restaurant });
});

app.get("/restaurants/:id/edit", async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  res.render("restaurants/edit", { restaurant });
});

app.put("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    {
      ...req.body.restaurant,
    },
    { new: true }
  );
  res.redirect(`/restaurants/${id}`);
});

app.delete("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  await Restaurant.findByIdAndDelete(id);
  res.redirect("/restaurants");
});

app.listen(3000, () => {
  console.log("on PORT 3000");
});
