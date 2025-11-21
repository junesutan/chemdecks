const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createResponse } = require("../controllers/responsesController");

router.post("/", auth, createResponse);

module.exports = router;
