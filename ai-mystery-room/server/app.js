// server/app.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// Attempt loading local .env (skipped automatically in cloud environments if not present)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// CORS configuration supporting single-domain or separate frontend deployment
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : null;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, same-origin, or curl)
      if (!origin || !allowedOrigins || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Mystery Room API',
    env: process.env.NODE_ENV || 'development',
  });
});

// Mystery API Routes
const mysteryRoutes = require('./routes/mysteries');
const errorHandler = require('./middleware/errorHandler');

app.use('/api/mysteries', mysteryRoutes);

// In production, serve the built React frontend if client/dist exists
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all SPA fallback middleware (compatible with Express 5 path-to-regexp)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use(errorHandler);

module.exports = app;
