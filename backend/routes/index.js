const express = require('express');
const router = express.Router();

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

module.exports = router;

