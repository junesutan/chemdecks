console.log("SERVER FILE LOADED");

require("dotenv").config(); //load database url
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// add middleware
app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// import routes
app.use("/users", require("./routes/users"));
app.use("/decks", require("./routes/decks.js"));
app.use("/cards", require("./routes/cards.js"));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
