const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/studentProfilesController");

router.get("/me/profile", auth, getMyProfile);
router.patch("/me/profile", auth, updateMyProfile);

module.exports = router;
