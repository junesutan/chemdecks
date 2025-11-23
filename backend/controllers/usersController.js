const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createProfileForNewUser } = require("./studentProfilesController");

exports.registerUser = async (req, res) => {
  try {
    console.log("REQ BODY =", req.body);
    const { name, email, password, role } = req.body;

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || "student"]
    );

    const newUser = result.rows[0];

    // 3. Only create student profile for students
    if (newUser.role === "student") {
      await createProfileForNewUser(newUser.id);
    }

    // 4. Create TOKEN
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("token", token);
    console.log("res", res);

    // 5. Send Response
    res.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: token,
    });

    navigate("/login");
  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // 2. compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // 3. create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.name, users.email
       FROM users
       WHERE users.role = 'student'
       ORDER BY users.name ASC`
    );
    console.log("result: ", result);
    res.json(result.rows);
  } catch (err) {
    console.error("Error loading students:", err);
    res.status(500).json({ error: err.message });
  }
};
