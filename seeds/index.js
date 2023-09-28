// Check if not in production mode, load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Required modules and dependencies
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seed_helpers");
const Restaurant = require("../models/restaurant");
const dbUrl = process.env.DB_URL;

// Establish MongoDB connection
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Database Error!");
    console.log(err);
  });

// Utility functions
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const randPrice = async () => "$".repeat(Math.floor(Math.random() * 3 + 1));

// Seed the database with random restaurant data
const seedDB = async () => {
  await Restaurant.deleteMany({}); // Clear existing restaurants
  
  for (let i = 0; i < 350; i++) {  // Populate with 350 new restaurants
    const rand100 = Math.floor(Math.random() * 100);
    const restaurant = new Restaurant({
      author: "650bd5e400683c5338b1faf5",  // Static author ID
      title: `${sample(descriptors)} ${sample(places)}`,
      priceRange: await randPrice(),
      location: `${cities[rand100].city}, ${cities[rand100].province}`,
      description: "Lorem ipsum ...",  // Static description
      geometry: {
        type: "Point",
        coordinates: [cities[rand100].longitude, cities[rand100].latitude],
      },
      images: [{
        url: "https://res.cloudinary.com/dgegokbk6/image/upload/v1695273206/GourmetGuide/viseysket4wzbbjezzmp.jpg",
        filename: "GourmetGuide/ktugqpih9qsw7p8x2cgs",
      },
      {
        url: "https://res.cloudinary.com/dgegokbk6/image/upload/v1694637744/GourmetGuide/gohgkyzemb71ajjvha16.jpg",
        filename: "GourmetGuide/gohgkyzemb71ajjvha16",
      },
      {
        url: "https://res.cloudinary.com/dgegokbk6/image/upload/v1694637744/GourmetGuide/d5i5hmdzntpnhyf3bnfu.jpg",
        filename: "GourmetGuide/d5i5hmdzntpnhyf3bnfu",
      }]
    });
    await restaurant.save();  // Save to the database
  }
};

// Execute the seed function and then close the MongoDB connection
seedDB().then(() => {
  mongoose.connection.close();
});

