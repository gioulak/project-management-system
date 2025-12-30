const db = require('../config/database');

class User {
  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM `users` WHERE `username` = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('findByUsername error:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM `users` WHERE `email` = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('findByEmail error:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT `id`, `username`, `email`, `first_name`, `last_name`, `role`, `is_active`, `created_at` FROM `users` WHERE `id` = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('findById error:', error);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { username, email, password, first_name, last_name } = userData;
      
      // Use backticks around table and column names to avoid reserved word issues
      const [result] = await db.query(
        'INSERT INTO `users` (`username`, `email`, `password`, `first_name`, `last_name`) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, first_name, last_name]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('create user error:', error);
      throw error;
    }
  }

  // Get all users (Admin only)
  static async findAll() {
    try {
      const [rows] = await db.query(
        'SELECT `id`, `username`, `email`, `first_name`, `last_name`, `role`, `is_active`, `created_at` FROM `users` ORDER BY `created_at` DESC'
      );
      return rows;
    } catch (error) {
      console.error('findAll error:', error);
      throw error;
    }
  }

  // Update user role
  static async updateRole(userId, role) {
    try {
      const [result] = await db.query(
        'UPDATE `users` SET `role` = ? WHERE `id` = ?',
        [role, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('updateRole error:', error);
      throw error;
    }
  }

  // Activate user
  static async activate(userId) {
    try {
      const [result] = await db.query(
        'UPDATE `users` SET `is_active` = TRUE WHERE `id` = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('activate error:', error);
      throw error;
    }
  }

  // Deactivate user
  static async deactivate(userId) {
    try {
      const [result] = await db.query(
        'UPDATE `users` SET `is_active` = FALSE WHERE `id` = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('deactivate error:', error);
      throw error;
    }
  }

  // Delete user
  static async delete(userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM `users` WHERE `id` = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('delete error:', error);
      throw error;
    }
  }
}

module.exports = User;