const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Notes API is running");
});

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));



const noteRoutes = require("./routes/noteRoutes.js");
app.use("/notes", noteRoutes);

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

