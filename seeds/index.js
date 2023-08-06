const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Restaurant = require("../models/restaurant");

mongoose
  .connect("mongodb://127.0.0.1:27017/Gourmet-Guide")
  .then(() => {
    console.log("Mongo CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("Mongo ERROR!!!!");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Restaurant.deleteMany({});
  for (let i = 0; i < 45; i++) {
    const rand100 = Math.floor(Math.random() * 100);
    const restaurant = new Restaurant({
      location: `${cities[rand100].city}, ${cities[rand100].province}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await restaurant.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
