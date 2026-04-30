const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Sample route (keep your existing routes here)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Example confessions route (adjust if you already have one)
app.get("/confessions", (req, res) => {
  res.json({ message: "Confessions endpoint working" });
});

// 🔥 IMPORTANT FIX (THIS IS WHAT YOU WERE MISSING)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});