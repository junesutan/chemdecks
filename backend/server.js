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
app.use("/decks", require("./routes/decks"));
app.use("/cards", require("./routes/cards"));

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
