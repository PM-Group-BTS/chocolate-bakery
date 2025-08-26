const db = require('../utils/db');

/**
 * User model for database operations
 */
class User {
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  static async findByEmail(email) {
    try {
      const users = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  static async findById(id) {
    try {
      const users = await db.query(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [id]
      );
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data (name, email, password, role)
   * @returns {Promise<Object>} - Created user object
   */
  static async create(userData) {
    try {
      const result = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.role]
      );
      
      return { id: result.insertId, ...userData };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

