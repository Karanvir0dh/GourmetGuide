// Importing the necessary modules for image storage and processing
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuring cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Setting up the storage parameters for multer to store images in Cloudinary.
// Images will be stored in the "GourmetGuide" folder and only jpeg, jpg, and png formats are allowed.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "GourmetGuide",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});

// Exporting the configured cloudinary and storage for use in other parts of the application
module.exports = {
  cloudinary,
  storage,
};
