import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "app.db");

export const db = new sqlite3.Database(DB_PATH, (err) => {

    if (err) {
        console.error("failed to connect to SQLite:", err.message);
        return;
    }

    console.log("Connected to SQLite at:", DB_PATH);

});

export function initDb() {
    
    return new Promise((resolve, reject) => {

        db.run(
            `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            `,
            (err) => {
                if (err) return reject(err);
                resolve();
            }

        );

    });
}