const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/restaurants", restaurantsRoutes);
app.use("/restaurants/:id/reviews", reviewsRoutes);

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
