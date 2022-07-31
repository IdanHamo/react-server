const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 1024,
    },
    email: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 400,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    premium: {
      type: Boolean,
      required: true,
    },
  },
  {
    methods: {
      generateAuthToken() {
        const token = jwt.sign(
          {
            _id: this._id,
            premium: this.premium,
          },
          config.get("jwtKey")
        );
        return token;
      },
    },
  }
);

// userSchema.methods.generateAuthToken =

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().required().min(2).max(255),
    password: Joi.string().required().min(8).max(1024),
    email: Joi.string().required().min(6).max(400),
    premium: Joi.boolean().required(),
  });

  return schema.validate(user);
}

module.exports = { validateUser, User };
