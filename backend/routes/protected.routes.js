const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

/**
 * @route GET /api/protected/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticate, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

/**
 * @route GET /api/protected/baker
 * @desc Baker only route
 * @access Private (Baker role)
 */
router.get('/baker', authenticate, authorize(['baker']), (req, res) => {
  res.json({
    status: 'success',
    message: 'Baker dashboard data',
    data: {
      // Baker specific data would go here
      orders: [
        { id: 1, status: 'pending', product: 'Chocolate Cake' },
        { id: 2, status: 'in-progress', product: 'Cupcakes' }
      ]
    }
  });
});

/**
 * @route GET /api/protected/sales
 * @desc Sales only route
 * @access Private (Sales role)
 */
router.get('/sales', authenticate, authorize(['sales']), (req, res) => {
  res.json({
    status: 'success',
    message: 'Sales dashboard data',
    data: {
      // Sales specific data would go here
      orders: [
        { id: 1, customer: 'John Doe', product: 'Chocolate Cake', price: 25.99 },
        { id: 2, customer: 'Jane Smith', product: 'Cupcakes', price: 12.99 }
      ]
    }
  });
});

/**
 * @route GET /api/protected/delivery
 * @desc Delivery only route
 * @access Private (Delivery role)
 */
router.get('/delivery', authenticate, authorize(['delivery']), (req, res) => {
  res.json({
    status: 'success',
    message: 'Delivery dashboard data',
    data: {
      // Delivery specific data would go here
      deliveries: [
        { id: 1, customer: 'John Doe', address: '123 Main St', status: 'pending' },
        { id: 2, customer: 'Jane Smith', address: '456 Oak Ave', status: 'in-transit' }
      ]
    }
  });
});

module.exports = router;

