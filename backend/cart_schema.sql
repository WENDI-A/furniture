-- Cart table schema for the furniture e-commerce application

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  color VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  
  -- Indexes for better performance
  INDEX idx_userId (userId),
  INDEX idx_productId (productId),
  INDEX idx_user_product_color (userId, productId, color)
);

-- Sample data (optional - for testing)
-- INSERT INTO cart (userId, productId, quantity, color, price) VALUES 
-- (1, 1, 2, 'blue', 199.99),
-- (1, 3, 1, 'black', 179.99); 