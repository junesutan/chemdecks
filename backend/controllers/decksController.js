const pool = require("../db/db");

exports.getDecks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query("SELECT * FROM decks WHERE user_id = $1", [
      userId,
    ]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDeck = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    `INSERT INTO decks (user_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, description`,
    [userId, title, description]
  );

  res.json(result.rows[0]);
};

exports.getDeckById = async (req, res) => {
  try {
    const deckId = req.params.id;
    const userId = req.user.id; // logged in user

    const result = await pool.query(
      "SELECT * FROM decks WHERE id = $1 AND user_id = $2",
      [deckId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deck not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDeck = async (req, res) => {
  try {
    const deckId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;

    const result = await pool.query(
      `UPDATE decks 
       SET title = $1, description = $2 
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, description, deckId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deck not found or not yours" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDeck = async (req, res) => {
  try {
    const deckId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING *",
      [deckId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deck not found or not yours" });
    }

    res.json({ message: "Deck deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
