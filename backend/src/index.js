// src/index.js
// This is the main entry point for our backend application.

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// --- Import Routes ---
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js'; // <-- ADD THIS LINE

// Load environment variables from a .env file into process.env
dotenv.config();

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) to allow our frontend to communicate with this backend.
app.use(cors());
// Enable the express server to parse incoming JSON payloads.
app.use(express.json());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb/monsters11';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Could not connect to MongoDB.', err));

// --- Real-time Setup with Socket.io ---
// We create an HTTP server from our Express app.
const server = http.createServer(app);
// We attach Socket.io to the HTTP server, configuring CORS for it as well.
const io = new Server(server, {
  cors: {
    origin: "*", // In production, you should restrict this to your frontend's URL
    methods: ["GET", "POST"]
  }
});

// Listen for new connections from clients (our React app)
io.on('connection', (socket) => {
  console.log(`A user connected with socket id: ${socket.id}`);

  // Listen for a client to disconnect
  socket.on('disconnect', () => {
    console.log(`User with socket id: ${socket.id} disconnected.`);
  });
});

// --- API Routes ---
// A simple test route to make sure the server is running.
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Monsters11 API! 🐲' });
});

// Use the authentication routes for any requests to /api/auth
app.use('/api/auth', authRoutes);
// Use the post routes for any requests to /api/posts
app.use('/api/posts', postRoutes); // <-- ADD THIS LINE


// --- Start the Server ---
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
