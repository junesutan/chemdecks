const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDecks, createDeck } = require("../controllers/decksController");

router.post("/", auth, createDeck);

router.get("/", auth, getDecks);

module.exports = router;
