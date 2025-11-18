const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getDecks,
  createDeck,
  getDeckById,
  updateDeck,
  deleteDeck,
} = require("../controllers/decksController");

router.post("/", auth, createDeck);

router.get("/", auth, getDecks);

router.get("/:id", auth, getDeckById);

router.put("/:id", auth, updateDeck);

router.delete("/:id", auth, deleteDeck);

module.exports = router;
