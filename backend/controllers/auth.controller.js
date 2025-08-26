const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Token expiration time
const TOKEN_EXPIRATION = '24h';

/**
 * User authentication controller
 */
class AuthController {
  /**
   * Login user and generate JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with token or error
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      // Return token and user info (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          token,
          user: userWithoutPassword
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with user data or error
   */
  static async register(req, res) {
    try {
      const { name, email, password, role = 'user' } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Name, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;

