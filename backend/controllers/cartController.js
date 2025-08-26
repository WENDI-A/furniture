const db = require("../db");

// Add item to cart
exports.addToCart = (req, res) => {
  const { userId, productId, quantity, color } = req.body;
  
  // Validate required fields
  if (!userId || !productId || !quantity || !color) {
    return res.status(400).json({ 
      error: "Missing required fields: userId, productId, quantity, color" 
    });
  }

  // Check if product exists
  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = results[0];

    // Check if item already exists in cart
    db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND color = ?",
      [userId, productId, color],
      (err, cartResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        if (cartResults.length > 0) {
          // Update existing cart item
          const newQuantity = cartResults[0].quantity + quantity;
          db.query(
            "UPDATE cart SET quantity = ? WHERE id = ?",
            [newQuantity, cartResults[0].id],
            (err, updateResult) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to update cart" });
              }
              res.json({ 
                message: "Cart updated successfully", 
                cartItem: { ...cartResults[0], quantity: newQuantity }
              });
            }
          );
        } else {
          // Add new cart item
          const cartItem = {
            user_id: userId,
            product_id: productId,
            quantity,
            color,
            price_at_time: product.price,
            created_at: new Date()
          };

          db.query(
            "INSERT INTO cart (user_id, product_id, quantity, color, price_at_time, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            [cartItem.user_id, cartItem.product_id, cartItem.quantity, cartItem.color, cartItem.price_at_time, cartItem.created_at],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to add to cart" });
              }
              cartItem.id = result.insertId;
              res.status(201).json({ 
                message: "Item added to cart successfully", 
                cartItem 
              });
            }
          );
        }
      }
    );
  });
};

// Get user's cart
exports.getCart = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
    SELECT 
      c.id,
      c.quantity,
      c.color,
      c.price_at_time AS cartPrice,
      c.created_at,
      p.id AS productId,
      p.title,
      p.description,
      p.image,
      p.price AS productPrice,
      p.category,
      p.company
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    // Calculate totals
    const cartItems = results.map(item => ({
      ...item,
      totalPrice: (item.cartPrice * item.quantity).toFixed(2)
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + (item.cartPrice * item.quantity), 0);
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    res.json({
      cartItems,
      summary: {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        itemCount: cartItems.length
      }
    });
  });
};

// Update cart item quantity
exports.updateCartItem = (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: "Valid quantity is required" });
  }

  db.query(
    "UPDATE cart SET quantity = ? WHERE id = ?",
    [quantity, cartItemId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json({ message: "Cart item updated successfully" });
    }
  );
};

// Remove item from cart
exports.removeFromCart = (req, res) => {
  const { cartItemId } = req.params;

  db.query("DELETE FROM cart WHERE id = ?", [cartItemId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart successfully" });
  });
};

// Clear user's entire cart
exports.clearCart = (req, res) => {
  const { userId } = req.params;

  db.query("DELETE FROM cart WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ 
      message: "Cart cleared successfully", 
      itemsRemoved: result.affectedRows 
    });
  });
};

// Get cart count for user (for navbar badge)
exports.getCartCount = (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT COUNT(*) as count FROM cart WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ count: results[0].count });
    }
  );
};
