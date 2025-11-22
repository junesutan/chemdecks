const pool = require("../db/db");

// POST /assignments
exports.assignHomework = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { student_id, deck_id, due_date } = req.body;

    // Loop through ALL selected students
    for (const studentId of student_id) {
      await pool.query(
        `INSERT INTO assigned_homework (teacher_id, student_id, deck_id, due_date)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id, deck_id) DO NOTHING`,
        [teacherId, studentId, deck_id, due_date]
      );
    }

    res.json({ message: "Homework assigned successfully" });
  } catch (err) {
    console.error("Assign homework error:", err);
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
