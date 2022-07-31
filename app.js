const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const user = require("./routes/users");
const auth = require("./routes/auth");
const cards = require("./routes/cards");

mongoose
  .connect("mongodb://localhost/HackerU")
  .then(() => console.log("successful connection"))
  .catch((e) => console.log("connection failed " + e));

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(express.json());
app.use(morgan());

app.use("/users", user);
app.use("/auth", auth);
app.use("/cards", cards);

const port = 3001;
app.listen(port, () => console.log("listening to port " + port));
