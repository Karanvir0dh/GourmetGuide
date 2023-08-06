const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("./models/restaurant");
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

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/makerestaurant", async (req, res) => {
//   const restaurant = new Restaurant({
//     title: "Tandoori Eh",
//     description: "Ghar aa biryani khilata hu",
//   });
//   await restaurant.save();
//   res.send(restaurant);
// });

app.listen(3000, () => {
  console.log("on PORT 3000");
});
