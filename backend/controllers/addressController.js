const db = require("../db");

// Get user's addresses
exports.getUserAddresses = (req, res) => {
  const { userId } = req.params;

  const query = "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};

// Add new address
exports.addAddress = (req, res) => {
  const {
    userId,
    addressType,
    firstName,
    lastName,
    company,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phone,
    isDefault
  } = req.body;

  // Validate required fields
  if (!userId || !firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !country) {
    return res.status(400).json({ 
      error: "Missing required fields: firstName, lastName, addressLine1, city, state, postalCode, country" 
    });
  }

  // If this is a default address, unset other default addresses for this user
  if (isDefault) {
    db.query(
      "UPDATE addresses SET is_default = FALSE WHERE user_id = ?",
      [userId],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to update existing default addresses" });
        }
      }
    );
  }

  const addressData = {
    user_id: userId,
    address_type: addressType || 'both',
    first_name: firstName,
    last_name: lastName,
    company: company || null,
    address_line1: addressLine1,
    address_line2: addressLine2 || null,
    city: city,
    state: state,
    postal_code: postalCode,
    country: country,
    phone: phone || null,
    is_default: isDefault || false
  };

  db.query(
    "INSERT INTO addresses SET ?",
    addressData,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add address" });
      }

      addressData.id = result.insertId;
      res.status(201).json({
        message: "Address added successfully",
        address: addressData
      });
    }
  );
};

// Update address
exports.updateAddress = (req, res) => {
  const { addressId } = req.params;
  const {
    addressType,
    firstName,
    lastName,
    company,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phone,
    isDefault
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !country) {
    return res.status(400).json({ 
      error: "Missing required fields: firstName, lastName, addressLine1, city, state, postalCode, country" 
    });
  }

  // Get user ID from address to check permissions
  db.query(
    "SELECT user_id FROM addresses WHERE id = ?",
    [addressId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Address not found" });
      }

      const userId = results[0].user_id;

      // If this is a default address, unset other default addresses for this user
      if (isDefault) {
        db.query(
          "UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?",
          [userId, addressId],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Failed to update existing default addresses" });
            }
          }
        );
      }

      const updateData = {
        address_type: addressType,
        first_name: firstName,
        last_name: lastName,
        company: company || null,
        address_line1: addressLine1,
        address_line2: addressLine2 || null,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
        phone: phone || null,
        is_default: isDefault || false
      };

      db.query(
        "UPDATE addresses SET ? WHERE id = ?",
        [updateData, addressId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update address" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Address not found" });
          }

          res.json({
            message: "Address updated successfully",
            address: { id: addressId, ...updateData }
          });
        }
      );
    }
  );
};

// Delete address
exports.deleteAddress = (req, res) => {
  const { addressId } = req.params;

  // Check if address exists and get user ID
  db.query(
    "SELECT user_id FROM addresses WHERE id = ?",
    [addressId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Address not found" });
      }

      // Delete the address
      db.query(
        "DELETE FROM addresses WHERE id = ?",
        [addressId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete address" });
          }

          res.json({ message: "Address deleted successfully" });
        }
      );
    }
  );
};

// Set default address
exports.setDefaultAddress = (req, res) => {
  const { addressId } = req.params;
  const { userId } = req.body;

  // First, unset all default addresses for this user
  db.query(
    "UPDATE addresses SET is_default = FALSE WHERE user_id = ?",
    [userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update existing default addresses" });
      }

      // Then set the selected address as default
      db.query(
        "UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?",
        [addressId, userId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to set default address" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Address not found" });
          }

          res.json({ message: "Default address updated successfully" });
        }
      );
    }
  );
};

// Get default address
exports.getDefaultAddress = (req, res) => {
  const { userId } = req.params;
  const { addressType } = req.query; // 'billing', 'shipping', or 'both'

  let query = "SELECT * FROM addresses WHERE user_id = ? AND is_default = TRUE";
  let params = [userId];

  if (addressType && addressType !== 'both') {
    query += " AND (address_type = ? OR address_type = 'both')";
    params.push(addressType);
  }

  query += " LIMIT 1";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No default address found" });
    }

    res.json(results[0]);
  });
};

// Validate address format
exports.validateAddress = (req, res) => {
  const {
    addressLine1,
    city,
    state,
    postalCode,
    country
  } = req.body;

  const errors = [];

  if (!addressLine1 || addressLine1.trim().length < 5) {
    errors.push("Address line 1 must be at least 5 characters long");
  }

  if (!city || city.trim().length < 2) {
    errors.push("City must be at least 2 characters long");
  }

  if (!state || state.trim().length < 2) {
    errors.push("State must be at least 2 characters long");
  }

  if (!postalCode || postalCode.trim().length < 3) {
    errors.push("Postal code must be at least 3 characters long");
  }

  if (!country || country.trim().length < 2) {
    errors.push("Country must be at least 2 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: "Address validation failed",
      details: errors
    });
  }

  res.json({ message: "Address format is valid" });
}; 