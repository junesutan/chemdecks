const pool = require("../db/db");

exports.createResponse = async (req, res) => {
  const { card_id, deck_id, student_answer, is_correct } = req.body;
  const user_id = req.user.id;

  const result = await pool.query(
    `INSERT INTO student_responses 
     (user_id, card_id, deck_id, student_answer, is_correct)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, card_id, deck_id, student_answer, is_correct]
  );

  res.json(result.rows[0]);
};
