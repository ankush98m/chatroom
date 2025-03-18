import express from "express";
// const http = require("http");
import WebSocket from "ws";
import { dbPromise, initDb } from './db';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;

const wss = new WebSocket.Server({ port: 8000});
const clients = new Map();

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (msg: string) => {
    const {type, username, message} = JSON.parse(msg.toString());
    if (type === 'join') {
        clients.set(username, ws);
        ws.send(JSON.stringify({type: 'history', messages: await fetchMessages()}));
    } else if (type === 'message') {
        await storeMessage(username, message);
        broadcast({type: 'message', username, message});
    }
  });

  ws.on("close", () => {
    clients.forEach((value, key) => {
      if (value === ws) clients.delete(key);
    });
  });
});

async function fetchMessages() {
    const db = await dbPromise;
    return db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100');
}

async function storeMessage(username: string, message: string) {
    const db = await dbPromise;
    await db.run('INSERT INTO messages (username, message) VALUES (?, ?)', username, message);
}

function broadcast(data: object) {
    clients.forEach((client) => client.send(JSON.stringify(data)));
}

initDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  });