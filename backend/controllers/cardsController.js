const pool = require("../db/db");

// CREATE CARD
exports.createCard = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { front, back } = req.body;

    const result = await pool.query(
      "INSERT INTO cards (deck_id, front, back) VALUES ($1, $2, $3) RETURNING *",
      [deckId, front, back]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL CARDS IN A DECK
exports.getCardsByDeck = async (req, res) => {
  try {
    const { deckId } = req.params;

    const result = await pool.query("SELECT * FROM cards WHERE deck_id = $1", [
      deckId,
    ]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE CARD
exports.getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM cards WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CARD
exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { front, back } = req.body;

    const result = await pool.query(
      "UPDATE cards SET front = $1, back = $2 WHERE id = $3 RETURNING *",
      [front, back, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE CARD
exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM cards WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
