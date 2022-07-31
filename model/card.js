const mongoose = require("mongoose");
const Joi = require("joi");

const cardSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  dishDescription: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 2048,
  },
  dishIngredients: {
    type: Array,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  dishInstructions: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 4096,
  },
  dishImage: {
    type: String,
    required: true,
    minLength: 11,
    maxLength: 1024,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(values) {
  const schema = Joi.object({
    dishName: Joi.string().min(2).max(255).required(),
    dishDescription: Joi.string().min(2).max(2048).required(),
    dishIngredients: Joi.array()
      .items(Joi.string().min(2).max(255).required())
      .required(),
    dishInstructions: Joi.string().min(2).max(4096).required(),
    dishImage: Joi.string().min(11).max(1024).allow("").uri().required(),
  });

  return schema.validate(values);
}

module.exports = { validateCard, Card };
