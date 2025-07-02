require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const pingRoute  = require("./routes/ping");
const scoreRoute = require("./routes/score");

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mount the routers:
app.use("/ping", pingRoute);
app.use("/score", scoreRoute);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
