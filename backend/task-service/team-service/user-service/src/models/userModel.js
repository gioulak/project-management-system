const db = require('../config/database');

class User {
  // Find user by username
  static async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, username, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Create new user
  static async create(userData) {
    const { username, email, password, first_name, last_name } = userData;
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, first_name, last_name]
    );
    return result.insertId;
  }

  // Get all users (Admin only)
  static async findAll() {
    const [rows] = await db.query(
      'SELECT id, username, email, first_name, last_name, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  // Update user role
  static async updateRole(userId, role) {
    const [result] = await db.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );
    return result.affectedRows > 0;
  }

  // Activate user
  static async activate(userId) {
    const [result] = await db.query(
      'UPDATE users SET is_active = TRUE WHERE id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }

  // Deactivate user
  static async deactivate(userId) {
    const [result] = await db.query(
      'UPDATE users SET is_active = FALSE WHERE id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(userId) {
    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
