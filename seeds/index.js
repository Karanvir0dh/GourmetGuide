const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Restaurant = require("../models/restaurant");
const axios = require("axios");

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
const seedImg = async () => {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "DXqJegQ554wJdpqItRzosH351RQuc_ygVuj9fJzSPRU",
        collections: 1028299,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
};
const randPrice = async () => {
  return "$".repeat(Math.floor(Math.random() * 3 + 1));
};

const seedDB = async () => {
  await Restaurant.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const rand100 = Math.floor(Math.random() * 100);
    const restaurant = new Restaurant({
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      priceRange: await randPrice(),
      location: `${cities[rand100].city}, ${cities[rand100].province}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus inventore consequuntur debitis itaque ipsa modi aliquam quod, exercitationem velit dicta repellendus officia, veniam sunt temporibus deleniti repudiandae quaerat, cupiditate cum.",
    });
    await restaurant.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
