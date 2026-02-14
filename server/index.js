import express from "express";
import { initDb, db } from "./db/db.js";
import bcrypt from "bcrypt";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";

const app = express();
const PORT = 3001;
const SQLiteStore = SQLiteStoreFactory(session);

// Middleware
app.use(express.json());

// Sessions
app.use(
    session({
        store: new SQLiteStore({
            db: "sessions.db",
            dir: "./db",
        }),
        secret: "dev-secret-change-me",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);


// Routes
app.get("/health", (req, res) => {
    
    res.json({ok: true});

});

app.get("/debug/tables", (req, res) => {

    db.all(

        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
        (err, rows) => {

            if (err) return res.status(500).json({ error: err.message });
            res.json({ tables: rows.map((r) => r.name) });

        }

    );

});


// Register
app.post("/auth/register", async (req, res) => {
    
    let {username, email, password} = req.body;

    username = typeof username === "string" ? username.trim() : "";
    email = typeof email === "string" ? email.trim().toLowerCase() : "";


    // Validation
    if (typeof password !== "string") {
        return res.status(400).json({ error: "password must be a string" });
    }

    if (!username || !email || !password) {
        return res.status(400).json({ error: "username, email, and password are required" });
    }

    // Password Hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Upload into Database
    const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    db.run(sql, [username, email, passwordHash], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.status(409).json({ error: "email already exists" });
            }
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ id: this.lastID, username, email });

    });

});

// Create Login
app.post("/auth/login", (req, res) => {
    let { email, password } = req.body;

    email = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (typeof password !== "string") {
        return res.status(400).json({ error: "password must be a string" });
    }

    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    db.get(
        "SELECT id, username, email, password_hash FROM users WHERE email = ?",
        [email],
        async (err, user) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!user) {
                return res.status(401).json({ error: "invalid credentials" });
            }

            const ok = await bcrypt.compare(password, user.password_hash);
            if (!ok) {
                return res.status(401).json({ error: "invalid credentials" });
            }

            req.session.userId = user.id;

            res.json({ ok: true, id: user.id, username: user.username });
        }
    );
});

// Validate Login
app.get("/auth/me", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ loggedIn: false });
    }

    db.get(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [userId],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!user) {
                return res.status(401).json({ loggedIn: false });
            }

            res.json({ loggedIn: true, user });
        }
    );
});

// Logout
app.post("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "failed to logout" });

        res.clearCookie("connect.sid");

        res.json({ ok: true });
    });
});

// Debug
app.get("/debug/session", (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    res.json({ views: req.session.views });
});

// Initialize
await initDb();
console.log("DB initialized (users table ready).");

app.listen(PORT, () => {

    console.log(`API listening on http://localhost:${PORT}`);

});

