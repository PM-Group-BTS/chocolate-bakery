const express = require('express');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Login user and get token
 * @access Public
 */
router.post('/login', AuthController.login);
router.get('/login', (req, res) => {
    console.log('GET /login called');
    res.send('Login endpoint. Please use POST method to login.');
});
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', AuthController.register);

module.exports = router;

