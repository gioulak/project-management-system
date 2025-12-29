-- Create database if not exists
CREATE DATABASE IF NOT EXISTS pms_users;
USE pms_users;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role ENUM('ADMIN', 'TEAM_LEADER', 'MEMBER') DEFAULT 'MEMBER',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role, is_active) 
VALUES (
  'admin', 
  'admin@pms.com', 
  '$2a$10$CwTycUXWue0Thq9StjUM0uJ8KV8qXKr3K5dV8vJJqLqQp1G1pKvZS',
  'Admin',
  'User',
  'ADMIN',
  TRUE
) ON DUPLICATE KEY UPDATE username=username;