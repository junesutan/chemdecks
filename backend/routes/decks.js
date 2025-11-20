const pool = require("../db/db");
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

// GET all decks for logged-in user
router.get("/", auth, getDecks);

// CREATE deck
router.post("/", auth, createDeck);

// GET deck by ID
router.get("/:id", auth, getDeckById);

// UPDATE deck
router.put("/:id", auth, updateDeck);

// DELETE deck
router.delete("/:id", auth, deleteDeck);

// BULK ADD CARDS
router.post("/:deckId/cards/bulk", auth, async (req, res) => {
  console.log("Bulk route loaded");
  const { deckId } = req.params;
  const { cards } = req.body;

  if (!cards || cards.length === 0) {
    return res.status(400).json({ error: "No cards provided" });
  }

  const values = cards
    .map((c, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
    .join(",");

  const params = [deckId];
  cards.forEach((c) => params.push(c.question, c.answer));

  const query = `
    INSERT INTO cards (deck_id, question, answer)
    VALUES ${values}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

module.exports = router;
