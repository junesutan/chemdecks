const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createCard,
  getCardsByDeck,
  getCardById,
  updateCard,
  deleteCard,
} = require("../controllers/cardsController");

// Create one card in a deck
router.post("/:deckId", auth, createCard);

// Get all cards in a deck
router.get("/deck/:deckId", auth, getCardsByDeck);

// Get single card
router.get("/:id", auth, getCardById);

// Update card
router.put("/:id", auth, updateCard);

// Delete card
router.delete("/:id", auth, deleteCard);

module.exports = router;
