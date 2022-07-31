const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../model/users");

router.post("/login", async (req, res) => {
  
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("user does not exist");
  }
  const validatePassword = bcrypt.compare(req.body.password, user.password);
  if (!validatePassword) {
    return res.status(400).send("invalid email or password");
  }

  const token = user.generateAuthToken();
  res.status(200).send(token);
});

function loginValidation(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(400).email().required(),
    password: Joi.string().max(1024).min(8).required(),
  });
  return schema.validate(user);
}

module.exports = router;
