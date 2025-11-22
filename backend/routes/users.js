console.log("USERS ROUTE FILE LOADED");

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const pool = require("../db/db");
const {
  registerUser,
  loginUser,
} = require("../controllers/usersController.js");

// POST /users/register
router.post("/register", registerUser);

// POST /users/login
router.post("/login", loginUser);

// GET /users (test route)
router.get("/", (req, res) => {
  res.send("Users route working");
});

router.get("/students", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email 
       FROM users 
       WHERE role = 'student'`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
