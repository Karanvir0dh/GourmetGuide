// Import necessary modules from mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import the passport-local-mongoose plugin to simplify building username and password login with Passport
const passportLocalMongoose = require("passport-local-mongoose");

// Define the schema for users
const UserSchema = new Schema({
  // The email for the user which is required and must be unique in the database
  email: {
    type: String,       // The data type for email is a string
    required: true,     // This field is mandatory
    unique: true,       // No two users can have the same email
  },
});

// Apply the passportLocalMongoose plugin to UserSchema.
// This will add a username, a hashed password, and some utility methods to the schema
UserSchema.plugin(passportLocalMongoose);

// Export the User model based on the defined schema
module.exports = mongoose.model("User", UserSchema);
