import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import rateLimit from 'express-rate-limit';

import profileRoutes from './routes/profile.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import skillsRoutes from './routes/skills.js';
import activityRoutes from './routes/activity.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Basic rate limiting on the contact form to prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many messages sent. Please try again later.' }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api', activityRoutes);

app.get('/api/github-stats', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch('https://github.com/ANUrag45r', { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const html = await response.text();
    // Regex matches numbers like "1,102" followed by "contributions"
    const match = html.match(/(\d[\d,]*)\s+contributions/i);
    const count = match ? match[1] : '1,100';
    
    res.json({ success: true, contributions: count });
  } catch (err) {
    console.error('GitHub stats scrape error:', err);
    res.json({ success: false, contributions: '1,100' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
});
