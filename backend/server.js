import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/mongodb.js';
import profileRoutes from './routes/profile.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import skillsRoutes from './routes/skills.js';
import activityRoutes from './routes/activity.js';
import analyticsRoutes from './routes/analytics.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for Vercel/Railway reverse proxies to capture correct IPs
app.set('trust proxy', true);

// Connect to MongoDB
connectDB();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Set up server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// Expose socket instance to routes
app.set('io', io);

// Store active users in memory (socket.id -> { visitorId, page })
const activeUsers = {};
app.set('activeUsers', activeUsers);

io.on('connection', (socket) => {
  // Listen for client registration
  socket.on('analytics:join', ({ visitorId, page }) => {
    activeUsers[socket.id] = { visitorId, page: page || '#top' };
    // Broadcast active count to all admin dashboard sockets
    io.emit('analytics:active_count', Object.keys(activeUsers).length);
  });

  // Listen for page/section changes
  socket.on('analytics:page_update', ({ page }) => {
    if (activeUsers[socket.id]) {
      activeUsers[socket.id].page = page;
    }
  });

  socket.on('disconnect', () => {
    delete activeUsers[socket.id];
    io.emit('analytics:active_count', Object.keys(activeUsers).length);
  });
});

// Basic rate limiting on the contact form to prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many messages sent. Please try again later.' }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', mongodb: 'connected' }));

app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api', activityRoutes);

// Mount Ingestion and Dashboard Analytics routers
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminAnalyticsRoutes);

app.get('/api/github-stats', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch('https://github.com/ANUrag45r', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const html = await response.text();
    const match = html.match(/(\d[\d,]*)\s+contributions/i);
    const count = match ? match[1] : '1,100';
    
    res.json({ success: true, contributions: count });
  } catch (err) {
    console.error('GitHub stats scrape error:', err);
    res.json({ success: false, contributions: '1,100' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

server.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
});
