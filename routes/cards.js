const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { validateCard, Card } = require("../model/card");

router.get("/allCards/:searchResult", auth, async (req, res) => {
  const cards = await Card.find({
    dishName: req.params.searchResult,
  });
  if (!cards) return res.status(404).send("no results");
  res.status(200).send(cards);
});

router.get("/my-card/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) return res.status(404).send("Card not found");

  res.status(200).send(card);
});

router.put("/editRecipe/:id", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );

  if (!card)
    return res.status(404).send("the card with the given ID is not found");

  card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
  res.status(200).send(card);
});

router.get("/fullRecipe/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("card doesn't found");
  }
  res.status(200).send(card);
});

router.delete("/:id", auth, async (req, res) => {
  const card = await Card.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });

  res.status(200).send(card);
});

router.get("/my-cards", auth, async (req, res) => {
  if (!req.user.premium) return res.status(400).send("access denied");

  const cards = await Card.find({ user_id: req.user._id });
  res.status(200).send(cards);
});

router.post("/createRecipe", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const card = new Card({
    dishName: req.body.dishName,
    dishDescription: req.body.dishDescription,
    dishIngredients: req.body.dishIngredients,
    dishInstructions: req.body.dishInstructions,
    dishImage: req.body.dishImage
      ? req.body.dishImage
      : "https://cdn.w600.comps.canstockphoto.com/recipes-3d-concept-stock-illustration_csp9417848.jpg",
    user_id: req.user._id,
  });

  const result = await card.save();
  res.status(200).send(result);
});

module.exports = router;
