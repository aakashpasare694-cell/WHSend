import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import channelsRouter from './routes/channels.js';
import messagesRouter from './routes/messages.js';
import { WhatsAppManager } from './services/whatsapp.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

const waManager = WhatsAppManager.getInstance();
waManager.setSocketIO(io);

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/channels', channelsRouter);
app.use('/api/v1/messages', messagesRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend build static files in production if available
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (res.headersSent) return;
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Frontend not built. Please run Vite dev server on port 3000.');
    }
  });
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 WHSend Gateway Server running on port ${PORT}`);
  console.log(`📡 WebSocket server initialized`);
  console.log(`====================================================`);

  // Restore stored WhatsApp sessions on boot
  await waManager.initializeStoredSessions();
});
