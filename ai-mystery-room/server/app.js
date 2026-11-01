// server/app.js
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Mystery Room API',
  });
});

// Routes
const mysteryRoutes = require('./routes/mysteries');
const errorHandler = require('./middleware/errorHandler');

app.use('/api/mysteries', mysteryRoutes);
app.use(errorHandler);

module.exports = app;
