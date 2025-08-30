const db = require('../utils/db');

/**
 * User model for database operations
 */
class User {
  /**
   * Find a user by username
   * @param {string} username - User username
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  static async findByUsername(username) {
    try {
      const users = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
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
        'SELECT id, username, email,  FROM users WHERE id = ?',
        [id]
      );
      console.log(users.length)
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data (name, email, password)
   * @returns {Promise<Object>} - Created user object
   */
  static async create(userData) {
    try {
      const result = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, userData.password]
      );
      
      return { id: result.insertId, ...userData };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

