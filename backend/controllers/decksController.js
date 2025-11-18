const pool = require("../db/db");

exports.createDeck = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      "INSERT INTO decks (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
