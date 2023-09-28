// Required modules and dependencies
const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Create a Joi extension to sanitize and check for HTML
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

// Extend the base Joi validation with the custom extension
const Joi = BaseJoi.extend(extension);

// Define a schema for restaurant validation
module.exports.restaurantSchema = Joi.object({
  restaurant: Joi.object({
    title: Joi.string().required().escapeHTML(),
    priceRange: Joi.required(),
    // images: Joi.array().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

// Define a schema for review validation
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().escapeHTML().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
