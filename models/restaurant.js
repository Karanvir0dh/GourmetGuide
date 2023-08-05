const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  title: String,
  type: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
