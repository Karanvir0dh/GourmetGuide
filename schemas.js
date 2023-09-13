const Joi = require("joi");

module.exports.restaurantSchema = Joi.object({
  restaurant: Joi.object({
    title: Joi.string().required(),
    priceRange: Joi.required(),
    // images: Joi.array().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
