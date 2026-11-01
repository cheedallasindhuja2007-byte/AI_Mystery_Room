// server/server.js
const path = require('path');
const dns = require('dns');

// On Windows, configure fallback DNS for local SRV lookups; on Linux cloud hosts (Render/Railway), use system DNS
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    // Ignore if not permitted
  }
}

// Load local .env if present (in cloud platforms, env vars are injected via process.env)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing.');
  console.error('👉 Please configure MONGODB_URI in your cloud deployment settings (e.g. Render Dashboard -> Environment).');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
