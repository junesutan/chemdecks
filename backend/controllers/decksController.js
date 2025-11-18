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
  const { title } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    "INSERT INTO decks (title, user_id) VALUES ($1, $2) RETURNING *",
    [title, userId]
  );

  res.json(result.rows[0]);
};
