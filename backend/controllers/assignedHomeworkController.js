const pool = require("../db/db");

// POST /assignments
exports.assignHomework = async (req, res) => {
  try {
    const teacherId = req.user.id; // id of the teacher assigning
    const { student_id, deck_id, due_date } = req.body;

    const result = await pool.query(
      `INSERT INTO assigned_homework (teacher_id, student_id, deck_id, due_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, deck_id) DO NOTHING
       RETURNING *`,
      [teacherId, student_id, deck_id, due_date]
    );

    res.json(result.rows[0] || { message: "Already assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /assignments/student
exports.getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `SELECT 
          a.*, 
          d.title,
          d.description,
          d.id AS deck_id
       FROM assigned_homework a
       JOIN decks d ON d.id = a.deck_id
       WHERE a.student_id = $1`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
