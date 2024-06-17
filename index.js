const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
require("dotenv").config();

const apiRoutes = require("./routes/apiRoutes");

// const PORT = process.env.PORT || 5059;

app.use(express.json()); //parse req.body
app.use(cors());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome To Active Aura API!</h1>");
});

app.listen(5059, () => {
  console.log(`app running at http://localhost:${5059}`);
});
