const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Database Setup
const db = new sqlite3.Database("./database.db");

// Create Transactions Table
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    category TEXT,
    amount REAL,
    paymentMethod TEXT,
    date TEXT
  )
`);

// API: Get All Transactions
app.get("/api/transactions", (req, res) => {
  db.all("SELECT * FROM transactions", (err, rows) => {
    if (err) res.status(500).send(err);
    else res.json(rows);
  });
});

// API: Add Transaction
app.post("/api/transactions", (req, res) => {
  const { type, category, amount, paymentMethod } = req.body;
  db.run(
    "INSERT INTO transactions (type, category, amount, paymentMethod, date) VALUES (?, ?, ?, ?, ?)",
    [type, category, amount, paymentMethod, new Date().toISOString()],
    (err) => {
      if (err) res.status(500).send(err);
      else res.json({ success: true });
    }
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});