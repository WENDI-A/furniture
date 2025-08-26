const db = require("../db");
const bcrypt = require("bcrypt");

// Get user profile
exports.getUserProfile = (req, res) => {
  const { userId } = req.params;

  const query = "SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  });
};

// Update user profile
exports.updateUserProfile = (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, phone } = req.body;

  // Validate required fields
  if (!firstName || !lastName) {
    return res.status(400).json({ 
      error: "Missing required fields: firstName, lastName" 
    });
  }

  const updateData = {
    first_name: firstName,
    last_name: lastName,
    phone: phone || null
  };

  db.query(
    "UPDATE users SET ? WHERE id = ?",
    [updateData, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update profile" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        profile: { id: userId, ...updateData }
      });
    }
  );
};

// Change password
exports.changePassword = (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      error: "Missing required fields: currentPassword, newPassword" 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      error: "New password must be at least 6 characters long" 
    });
  }

  // Get current password hash
  db.query(
    "SELECT password FROM users WHERE id = ?",
    [userId],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, results[0].password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedNewPassword, userId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update password" });
          }

          res.json({ message: "Password changed successfully" });
        }
      );
    }
  );
};

// Get user statistics
exports.getUserStats = (req, res) => {
  const { userId } = req.params;

  // Get order count and total spent
  const orderQuery = `
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_spent,
      MAX(created_at) as last_order_date
    FROM orders 
    WHERE user_id = ? AND order_status != 'cancelled'
  `;

  // Get wishlist count
  const wishlistQuery = "SELECT COUNT(*) as wishlist_count FROM wishlist WHERE user_id = ?";

  // Get review count
  const reviewQuery = "SELECT COUNT(*) as review_count FROM product_reviews WHERE user_id = ?";

  db.query(orderQuery, [userId], (err, orderResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(wishlistQuery, [userId], (err, wishlistResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      db.query(reviewQuery, [userId], (err, reviewResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        const stats = {
          total_orders: orderResults[0].total_orders || 0,
          total_spent: parseFloat(orderResults[0].total_spent || 0).toFixed(2),
          last_order_date: orderResults[0].last_order_date,
          wishlist_count: wishlistResults[0].wishlist_count || 0,
          review_count: reviewResults[0].review_count || 0
        };

        res.json(stats);
      });
    });
  });
};

// Get user's recent activity
exports.getUserActivity = (req, res) => {
  const { userId } = req.params;
  const { limit = 10 } = req.query;

  // Get recent orders
  const ordersQuery = `
    SELECT 
      'order' as type,
      o.id,
      o.order_number,
      o.total_amount,
      o.order_status,
      o.created_at,
      oi.product_name,
      oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    LIMIT ?
  `;

  // Get recent reviews
  const reviewsQuery = `
    SELECT 
      'review' as type,
      pr.id,
      pr.rating,
      pr.title,
      pr.created_at,
      p.title as product_name,
      p.image
    FROM product_reviews pr
    JOIN products p ON pr.product_id = p.id
    WHERE pr.user_id = ?
    ORDER BY pr.created_at DESC
    LIMIT ?
  `;

  // Get recent wishlist additions
  const wishlistQuery = `
    SELECT 
      'wishlist' as type,
      w.id,
      w.added_at as created_at,
      p.title as product_name,
      p.image,
      p.price
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.added_at DESC
    LIMIT ?
  `;

  db.query(ordersQuery, [userId, parseInt(limit)], (err, orderResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(reviewsQuery, [userId, parseInt(limit)], (err, reviewResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      db.query(wishlistQuery, [userId, parseInt(limit)], (err, wishlistResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        // Combine all activities and sort by date
        const allActivities = [
          ...orderResults.map(item => ({ ...item, activity_date: item.created_at })),
          ...reviewResults.map(item => ({ ...item, activity_date: item.created_at })),
          ...wishlistResults.map(item => ({ ...item, activity_date: item.created_at }))
        ];

        // Sort by activity date (most recent first)
        allActivities.sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date));

        // Limit total results
        const limitedActivities = allActivities.slice(0, parseInt(limit));

        res.json(limitedActivities);
      });
    });
  });
};

// Delete user account
exports.deleteUserAccount = (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required to delete account" });
  }

  // Verify password before deletion
  db.query(
    "SELECT password FROM users WHERE id = ?",
    [userId],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, results[0].password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Password is incorrect" });
      }

      // Start transaction to delete user data
      db.beginTransaction(async (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to start transaction" });
        }

        try {
          // Delete user's data in order (due to foreign key constraints)
          await db.query("DELETE FROM cart WHERE user_id = ?", [userId]);
          await db.query("DELETE FROM wishlist WHERE user_id = ?", [userId]);
          await db.query("DELETE FROM product_reviews WHERE user_id = ?", [userId]);
          await db.query("DELETE FROM addresses WHERE user_id = ?", [userId]);
          await db.query("DELETE FROM users WHERE id = ?", [userId]);

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Failed to delete account" });
              });
            }

            res.json({ message: "Account deleted successfully" });
          });
        } catch (error) {
          db.rollback(() => {
            console.error(error);
            res.status(500).json({ error: "Failed to delete account" });
          });
        }
      });
    }
  );
};

// Get user preferences (for future use)
exports.getUserPreferences = (req, res) => {
  const { userId } = req.params;

  // This is a placeholder for future user preferences
  // You can expand this to include things like:
  // - Preferred categories
  // - Email preferences
  // - Notification settings
  // - Language preferences
  
  const preferences = {
    email_notifications: true,
    marketing_emails: false,
    preferred_categories: [],
    language: 'en',
    currency: 'USD'
  };

  res.json(preferences);
};

// Update user preferences
exports.updateUserPreferences = (req, res) => {
  const { userId } = req.params;
  const { emailNotifications, marketingEmails, preferredCategories, language, currency } = req.body;

  // This is a placeholder for future user preferences
  // You would typically store these in a separate preferences table
  
  res.json({ 
    message: "Preferences updated successfully",
    preferences: {
      email_notifications: emailNotifications,
      marketing_emails: marketingEmails,
      preferred_categories: preferredCategories,
      language: language,
      currency: currency
    }
  });
}; 