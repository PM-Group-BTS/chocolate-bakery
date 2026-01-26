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
   * get a single user 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with token or error
   */
  static async getUserById(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required'
        });
      }

      // Find user by username
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      //console.log(isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }
      // Return token and user info (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        status: 'success',
        message: 'user found',
        data: {
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
   * Login user and generate JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with token or error
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required'
        });
      }

      // Find user by username
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      //console.log(isPasswordValid);
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
          username: user.username
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
      );

      console.log("token ",token)

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
      const { username, email, password } = req.body;
      const roles = process.env.DEFAULT_USERSCOPES || 'none';

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'User with this username already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword
      });

      // Remove password from response
      
      
      const { password: _, ...userWithoutPassword } = newUser;
      const userRoles = await User.saveRoles(userWithoutPassword.id, roles);
      userWithoutPassword.roles = userRoles;

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

