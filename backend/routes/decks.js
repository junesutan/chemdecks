const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createDeck } = require("../controllers/decksController");

router.post("/", auth, createDeck);

router.get("/", (req, res) => {
  res.send("Decks route working");
});

module.exports = router;
