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

  /**
   * Save roles for a user
   * @param {number} userId - User ID
   * @param {Array<string>} roles - Array of role names or IDs
   * @returns {Promise<void>}
   */
  static async saveRoles(userId, roles) {
    if (roles.length === 0) return;
    try {
      console.log("values saveRoles")
      // Remove existing roles for the user (optional, comment out if not needed)
      await db.query('DELETE FROM user_roles WHERE user_id = ?', [userId]);
      // Insert new roles
      await db.query(
        `INSERT INTO user_roles (user_id, roles) VALUES (${userId},'${roles}')`
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get roles for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array<string>>} - Array of roles
   */
  static async getRoles(userId) {
    try {
      const rows = await db.query(
        'SELECT role FROM user_roles WHERE user_id = ?',
        [userId]
      );
      return rows.map(row => row.role);
    } catch (error) {
      throw error;
    }
  }

}

module.exports = User;

