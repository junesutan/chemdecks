const pool = require("../db/db");

// GET: logged-in student's profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM student_profiles WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
