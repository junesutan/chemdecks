console.log("USERS ROUTE FILE LOADED");

const express = require("express");
const router = express.Router();
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

module.exports = router;
