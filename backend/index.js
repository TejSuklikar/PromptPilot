// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS so your React frontend can talk here
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
