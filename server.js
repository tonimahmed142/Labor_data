// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// serve static frontend files from project root
app.use(express.static(path.join(__dirname)));

// temporary in-memory DB (replace with real DB for persistence)
let records = [];
let finishedStatus = {};

// --- API ---
// health
app.get("/api", (req, res) => res.send("Labor Management API Online ✔"));

// get all data
app.get("/api/records", (req, res) => {
  res.json({ records, finishedStatus });
});

// add a record
app.post("/api/records", (req, res) => {
  const rec = req.body;
  if (!rec || !rec.id) return res.status(400).json({ error: "invalid" });
  records.push(rec);
  res.json({ success: true });
});

// update record
app.put("/api/records/:id", (req, res) => {
  const id = req.params.id;
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return res.json({ success: false });
  records[idx] = req.body;
  res.json({ success: true });
});

// delete record
app.delete("/api/records/:id", (req, res) => {
  const id = req.params.id;
  records = records.filter(r => r.id !== id);
  res.json({ success: true });
});

// finished status update (object map)
app.post("/api/finished", (req, res) => {
  finishedStatus = req.body || {};
  res.json({ success: true });
});

// export CSV (server side) - returns CSV download
app.get("/api/export.csv", (req, res) => {
  const headers = ['id','name','date','description','baki','jama','total','section'];
  const rows = records.map(r => headers.map(h => `"${String(r[h] != null ? r[h] : '')}"`).join(','));
  const csv = [headers.join(',')].concat(rows).join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="labor_data.csv"');
  res.send(csv);
});

// import (overwrite) - accepts JSON array of records (client can parse CSV and POST here)
app.post("/api/import", (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming)) return res.status(400).json({ error: "expected array" });
  records = incoming;
  // preserve finishedStatus if provided as second field
  res.json({ success: true, count: records.length });
});

// fallback serve index.html for any other routes (SPA/website)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
