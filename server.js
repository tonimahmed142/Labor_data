const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend (index.html, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Memory DB (temporary)
let records = [];
let finishedStatus = {};

// API: Get everything
app.get("/records", (req, res) => {
  res.json({ records, finishedStatus });
});

// API: Add record
app.post("/records", (req, res) => {
  records.push(req.body);
  res.json({ success: true });
});

// API: Update record
app.put("/records/:id", (req, res) => {
  const { id } = req.params;
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index] = req.body;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// API: Delete record
app.delete("/records/:id", (req, res) => {
  records = records.filter(r => r.id !== id);
  res.json({ success: true });
});

// API: Update finished status
app.post("/finished", (req, res) => {
  finishedStatus = req.body;
  res.json({ success: true });
});

// Fallback → If no API route matched, send index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
