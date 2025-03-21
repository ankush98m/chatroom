import express from "express";
import WebSocket from "ws";
import { dbPromise, initDb } from './db';
import cors from 'cors';

const app = express(); // initialize express app
app.use(cors()); // Middleware to enable cross-origin requests
app.use(express.json());
const PORT = 4000;

const wss = new WebSocket.Server({ port: 8000 }); // Initialize WebSocket server on port 8000
const clients = new Map(); // Map to store connected WebSocket clients by their username

// Websocket server connection handler
wss.on('connection', (ws: WebSocket) => {
    // Message event handler
  ws.on('message', async (msg: string) => {
    const {type, username, message} = JSON.parse(msg.toString());
    // Join event handler
    if (type === 'join') {
        if(clients.has(username)) {
            console.log('Username already taken. Try a different username');
            ws.send(JSON.stringify({type: 'error', message: 'Username already taken. Try a different username'}));
            ws.close();
            return;
        }
        clients.set(username, ws);
        ws.send(JSON.stringify({type: 'history', messages: await fetchMessages()}));
    } 
    // Message event handler
    else if (type === 'message') {
        await storeMessage(username, message);
        broadcast({type: 'message', username, message});
    } 
    // Typing event handler
    else if(type === 'typing'){
        broadcast({type: 'typing', username});
    } 
    // Leave event handler
    else if(type === 'leave'){
        clients.delete(username);
        broadcast({type: 'leave', username});
    }
  });


   // Close connection cleanup when a WebSocket client disconnects
  ws.on("close", () => {
    clients.forEach((value, key) => {
      if (value === ws) clients.delete(key);
    });
  });
});

// Function to fetch the messages from the database
async function fetchMessages() {
    const db = await dbPromise;
    return db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100');
}

// Function to store a new message in the database
async function storeMessage(username: string, message: string) {
    const db = await dbPromise;
    await db.run('INSERT INTO messages (username, message) VALUES (?, ?)', username, message);
}

// Function to broadcast a message or event to all connected clients
function broadcast(data: object) {
    clients.forEach((client) => client.send(JSON.stringify(data)));
}

// Initialize the database and start the server
initDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  });