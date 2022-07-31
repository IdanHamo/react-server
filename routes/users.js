const express = require("express");
const bcrypt = require("bcrypt");
const { validateUser, User } = require("../model/users");
const router = express.Router();

router.post("/createUser", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already exists");

  user = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.status(200).send(user);
});

module.exports = router;
