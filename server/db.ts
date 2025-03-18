import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


export const dbPromise = open({
    filename: "./chat.db",
    driver: sqlite3.Database,
  });

export async function initDb() {
  const db = await dbPromise;
  await db.exec(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}