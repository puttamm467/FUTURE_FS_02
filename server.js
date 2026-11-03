const express = require("express");
const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const PORT = 3000;

// Create database folder automatically
const databaseFolder = path.join(__dirname, "database");

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
}

// Connect to SQLite database
const db = new DatabaseSync(
    path.join(databaseFolder, "database.db")
);

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/app.js", (req, res) => {
    res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

// Create leads table
db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        source TEXT,
        status TEXT DEFAULT 'New',
        follow_up TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Get all leads
app.get("/api/leads", (req, res) => {
    const leads = db.prepare(
        "SELECT * FROM leads ORDER BY id DESC"
    ).all();

    res.json(leads);
});

// Dashboard statistics
app.get("/api/dashboard", (req, res) => {
    const total = db.prepare(
        "SELECT COUNT(*) AS count FROM leads"
    ).get().count;

    const converted = db.prepare(
        "SELECT COUNT(*) AS count FROM leads WHERE status = 'Converted'"
    ).get().count;

    const pending = db.prepare(`
        SELECT COUNT(*) AS count
        FROM leads
        WHERE follow_up IS NOT NULL
        AND follow_up != ''
        AND date(follow_up) >= date('now')
        AND status NOT IN ('Converted', 'Lost')
    `).get().count;

    const overdue = db.prepare(`
        SELECT COUNT(*) AS count
        FROM leads
        WHERE follow_up IS NOT NULL
        AND follow_up != ''
        AND date(follow_up) < date('now')
        AND status NOT IN ('Converted', 'Lost')
    `).get().count;

    const conversionRate = total
        ? ((converted / total) * 100).toFixed(1)
        : 0;

    res.json({
        total,
        converted,
        pending,
        overdue,
        conversionRate
    });
});

// Add new lead
app.post("/api/leads", (req, res) => {
    const {
        name,
        email,
        phone,
        company,
        source,
        status,
        follow_up,
        notes
    } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }

    const result = db.prepare(`
        INSERT INTO leads
        (name, email, phone, company, source, status, follow_up, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        name.trim(),
        email.trim(),
        phone || "",
        company || "",
        source || "Website",
        status || "New",
        follow_up || "",
        notes || ""
    );

    res.status(201).json({
        message: "Lead added successfully",
        id: Number(result.lastInsertRowid)
    });
});

// Update lead
app.put("/api/leads/:id", (req, res) => {
    const id = Number(req.params.id);

    const {
        name,
        email,
        phone,
        company,
        source,
        status,
        follow_up,
        notes
    } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const result = db.prepare(`
        UPDATE leads
        SET name = ?,
            email = ?,
            phone = ?,
            company = ?,
            source = ?,
            status = ?,
            follow_up = ?,
            notes = ?
        WHERE id = ?
    `).run(
        name.trim(),
        email.trim(),
        phone || "",
        company || "",
        source || "Website",
        status || "New",
        follow_up || "",
        notes || "",
        id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Lead not found"
        });
    }

    res.json({
        message: "Lead updated successfully"
    });
});

// Delete lead
app.delete("/api/leads/:id", (req, res) => {
    const result = db.prepare(
        "DELETE FROM leads WHERE id = ?"
    ).run(Number(req.params.id));

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Lead not found"
        });
    }

    res.json({
        message: "Lead deleted successfully"
    });
});

// Get follow-ups
app.get("/api/follow-ups", (req, res) => {
    const followUps = db.prepare(`
        SELECT *
        FROM leads
        WHERE follow_up IS NOT NULL
        AND follow_up != ''
        AND status NOT IN ('Converted', 'Lost')
        ORDER BY follow_up ASC
    `).all();

    res.json(followUps);
});

// Start server
app.listen(PORT, () => {
    console.log(`CRM Server running at http://localhost:${PORT}`);
});