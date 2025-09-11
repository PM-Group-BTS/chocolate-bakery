-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample users (passwords are 'password123' hashed with bcrypt)
-- In a real application, you would hash these passwords properly
INSERT INTO users (username, email, password, role) VALUES
('Baker User', 'baker@example.com', '$2b$10$6Bnl2T.0iEYP8DQqvDFxPeQvGTm0zKdJuC1.5zc.X5EiGwaqkEJHu'),
('Sales User', 'sales@example.com', '$2b$10$6Bnl2T.0iEYP8DQqvDFxPeQvGTm0zKdJuC1.5zc.X5EiGwaqkEJHu'),
('Delivery User', 'delivery@example.com', '$2b$10$6Bnl2T.0iEYP8DQqvDFxPeQvGTm0zKdJuC1.5zc.X5EiGwaqkEJHu');

