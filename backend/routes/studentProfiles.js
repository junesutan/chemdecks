const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getStudentProfileWithHomework,
  updateMyProfile,
} = require("../controllers/studentProfilesController");

// GET /students/me/profile
router.get("/me/profile", auth, getStudentProfileWithHomework);
router.patch("/me/profile", auth, updateMyProfile);

module.exports = router;
