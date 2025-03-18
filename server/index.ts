import express from "express";
// const http = require("http");
import WebSocket from "ws";
import { dbPromise, initDb } from './db';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;

initDb().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  });