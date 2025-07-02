const express = require("express");
const router  = express.Router();

// GET /ping → { message: "pong" }
router.get("/", (req, res) => {
  res.json({ message: "pong" });
});

module.exports = router;
