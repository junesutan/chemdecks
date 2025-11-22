const pool = require("../db/db");

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const teacherOnly = require("../middleware/teacherOnly");

const {
  assignHomework,
  getStudentAssignments,
} = require("../controllers/assignedHomeworkController");

// Teachers assign homework
router.post("/", auth, teacherOnly, assignHomework);

// GET assigned homework for logged-in student
router.get("/me", auth, async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `SELECT ah.id, ah.teacher_id, ah.deck_id, ah.assigned_at,
              d.title AS deck_title, d.description AS deck_description
       FROM assigned_homework ah
       JOIN decks d ON ah.deck_id = d.id
       WHERE ah.student_id = $1
       ORDER BY ah.assigned_at DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error → GET /assigned-homework/me:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
