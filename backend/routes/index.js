const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const protectedRoutes = require('./protected.routes');

// Welcome route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Chocolate Bakery API',
    version: '1.0.0'
  });
});

// Test route to verify API is working
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working correctly',
    timestamp: new Date()
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/protected', protectedRoutes);

module.exports = router;
