const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend (root of project)
app.use(express.static(path.join(__dirname, '../')));

// Database connection
mongoose.connect('mongodb://localhost:27017/smart-campus')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/placement', require('./routes/placement'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notices', require('./routes/notices'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Placement Portal Backend is working!' });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
