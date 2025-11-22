const pool = require("../db/db");

// GET full student profile + assigned homework
exports.getStudentProfileWithHomework = async (req, res) => {
  try {
    const studentId = req.user.id;

    // [1] fetch basic student profile
    const profileQuery = await pool.query(
      `SELECT sp.id, sp.weekly_points, sp.total_points, sp.weekly_rank, sp.streak,
              u.name, u.email
       FROM student_profiles sp
       JOIN users u ON sp.user_id = u.id
       WHERE sp.user_id = $1`,
      [studentId]
    );

    const profile = profileQuery.rows[0];

    // [2] Fetch assigned homework
    const homeworkQuery = await pool.query(
      `SELECT ah.id AS assignment_id,
              ah.deck_id,
              ah.assigned_at,
              d.title AS deck_title,
              d.description AS deck_description
       FROM assigned_homework ah
       JOIN decks d ON ah.deck_id = d.id
       WHERE ah.student_id = $1
       ORDER BY ah.assigned_at DESC`,
      [studentId]
    );

    const homework = homeworkQuery.rows;

    // [3] Combine into response
    res.json({
      ...profile,
      homework,
    });
  } catch (err) {
    console.error("Error in getStudentProfileWithHomework:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH: update points/streak/etc
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weekly_points, total_points, weekly_rank, streak } = req.body;

    const result = await pool.query(
      `UPDATE student_profiles
       SET 
         weekly_points = COALESCE($1, weekly_points),
         total_points = COALESCE($2, total_points),
         weekly_rank = COALESCE($3, weekly_rank),
         streak = COALESCE($4, streak),
         updated_at = NOW()
       WHERE user_id = $5
       RETURNING *`,
      [weekly_points, total_points, weekly_rank, streak, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create empty profile when new user signs up
exports.createProfileForNewUser = async (userId) => {
  try {
    await pool.query(
      `INSERT INTO student_profiles (user_id)
       VALUES ($1)`,
      [userId]
    );
  } catch (err) {
    console.error("Error creating student profile:", err);
  }
};
