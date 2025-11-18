const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Temporary memory DB (can be replaced by MongoDB/PostgreSQL later)
let records = [];
let finishedStatus = {};

// Test route
app.get("/", (req, res) => {
  res.send("Labor Management API Online ✔");
});

// Fetch all data
app.get("/records", (req, res) => {
  res.json({ records, finishedStatus });
});

// Add record
app.post("/records", (req, res) => {
  records.push(req.body);
  res.json({ success: true });
});

// Update record
app.put("/records/:id", (req, res) => {
  const { id } = req.params;
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = req.body;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Delete record
app.delete("/records/:id", (req, res) => {
  const { id } = req.params;
  records = records.filter((r) => r.id !== id);
  res.json({ success: true });
});

// Update worker finish state
app.post("/finished", (req, res) => {
  finishedStatus = req.body;
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
