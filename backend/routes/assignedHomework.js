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

// Students get their assigned homework
router.get("/student", auth, getStudentAssignments);

module.exports = router;
