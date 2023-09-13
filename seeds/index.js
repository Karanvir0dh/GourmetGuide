const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seed_helpers");
const Restaurant = require("../models/restaurant");
const axios = require("axios");

mongoose
  .connect("mongodb://127.0.0.1:27017/Gourmet-Guide")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Database Error!");
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
      author: "64ff6352d6312720bbf69b82",
      title: `${sample(descriptors)} ${sample(places)}`,
      priceRange: await randPrice(),
      location: `${cities[rand100].city}, ${cities[rand100].province}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus inventore consequuntur debitis itaque ipsa modi aliquam quod, exercitationem velit dicta repellendus officia, veniam sunt temporibus deleniti repudiandae quaerat, cupiditate cum.",
      images: [
        {
          url: "https://res.cloudinary.com/dgegokbk6/image/upload/v1694637743/GourmetGuide/ktugqpih9qsw7p8x2cgs.jpg",
          filename: "GourmetGuide/ktugqpih9qsw7p8x2cgs",
        },
        {
          url: "https://res.cloudinary.com/dgegokbk6/image/upload/v1694637744/GourmetGuide/gohgkyzemb71ajjvha16.jpg",
          filename: "GourmetGuide/gohgkyzemb71ajjvha16",
        },
        {
          url: "https://res.cloudinary.com/dgegokbk6/image/upload/v1694637744/GourmetGuide/d5i5hmdzntpnhyf3bnfu.jpg",
          filename: "GourmetGuide/d5i5hmdzntpnhyf3bnfu",
        },
      ],
    });
    await restaurant.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
