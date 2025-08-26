const db = require("../db");

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

// Create new order
exports.createOrder = async (req, res) => {
  const {
    userId,
    billingAddressId,
    shippingAddressId,
    paymentMethod,
    couponCode,
    notes
  } = req.body;

  try {
    // Get user's cart items
    const cartQuery = `
      SELECT 
        c.id as cart_id,
        c.product_id,
        c.variant_id,
        c.quantity,
        c.color as selected_color,
        c.size as selected_size,
        c.price_at_time,
        p.title as product_name,
        p.sku as product_sku,
        p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;

    db.query(cartQuery, [userId], async (err, cartItems) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Calculate totals
      let subtotal = 0;
      cartItems.forEach(item => {
        subtotal += item.price_at_time * item.quantity;
      });

      // Apply coupon if provided
      let discountAmount = 0;
      let couponId = null;
      if (couponCode) {
        const couponQuery = "SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND valid_from <= CURDATE() AND valid_until >= CURDATE()";
        db.query(couponQuery, [couponCode], (err, coupons) => {
          if (err || coupons.length === 0) {
            return res.status(400).json({ error: "Invalid or expired coupon code" });
          }
          
          const coupon = coupons[0];
          if (subtotal >= coupon.minimum_order_amount) {
            if (coupon.discount_type === 'percentage') {
              discountAmount = (subtotal * coupon.discount_value) / 100;
              if (coupon.maximum_discount) {
                discountAmount = Math.min(discountAmount, coupon.maximum_discount);
              }
            } else {
              discountAmount = coupon.discount_value;
            }
            couponId = coupon.id;
          }
        });
      }

      // Calculate tax (15%)
      const taxAmount = (subtotal - discountAmount) * 0.15;
      
      // Get shipping cost (default to standard shipping)
      const shippingAmount = 15.99;
      
      const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

      // Create order
      const orderData = {
        order_number: generateOrderNumber(),
        user_id: userId,
        billing_address_id: billingAddressId,
        shipping_address_id: shippingAddressId,
        payment_method: paymentMethod,
        subtotal: subtotal.toFixed(2),
        tax_amount: taxAmount.toFixed(2),
        shipping_amount: shippingAmount.toFixed(2),
        discount_amount: discountAmount.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        notes: notes || null
      };

      db.query(
        "INSERT INTO orders SET ?",
        orderData,
        (err, orderResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to create order" });
          }

          const orderId = orderResult.insertId;

          // Create order items
          const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            variant_id: item.variant_id,
            product_name: item.product_name,
            product_sku: item.product_sku,
            quantity: item.quantity,
            unit_price: item.price_at_time,
            total_price: (item.price_at_time * item.quantity).toFixed(2),
            selected_color: item.selected_color,
            selected_size: item.selected_size
          }));

          // Insert order items
          const orderItemsQuery = "INSERT INTO order_items (order_id, product_id, variant_id, product_name, product_sku, quantity, unit_price, total_price, selected_color, selected_size) VALUES ?";
          const orderItemsValues = orderItems.map(item => [
            item.order_id,
            item.product_id,
            item.variant_id,
            item.product_name,
            item.product_sku,
            item.quantity,
            item.unit_price,
            item.total_price,
            item.selected_color,
            item.selected_size
          ]);

          db.query(orderItemsQuery, [orderItemsValues], (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Failed to create order items" });
            }

            // Create shipping record
            const shippingData = {
              order_id: orderId,
              shipping_method_id: 1, // Default to standard shipping
              shipping_status: 'pending'
            };

            db.query(
              "INSERT INTO order_shipping SET ?",
              shippingData,
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Failed to create shipping record" });
                }

                // Clear user's cart
                db.query("DELETE FROM cart WHERE user_id = ?", [userId], (err) => {
                  if (err) {
                    console.error(err);
                    // Don't fail the order for cart clearing error
                  }

                  // Record coupon usage if applicable
                  if (couponId) {
                    const couponUsageData = {
                      coupon_id: couponId,
                      user_id: userId,
                      order_id: orderId,
                      discount_amount: discountAmount.toFixed(2)
                    };

                    db.query(
                      "INSERT INTO coupon_usage SET ?",
                      couponUsageData,
                      (err) => {
                        if (err) {
                          console.error(err);
                          // Don't fail the order for coupon usage error
                        }
                      }
                    );
                  }

                  res.status(201).json({
                    message: "Order created successfully",
                    order: {
                      id: orderId,
                      order_number: orderData.order_number,
                      total_amount: orderData.total_amount,
                      status: 'pending'
                    }
                  });
                });
              }
            );
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's orders
exports.getUserOrders = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      o.id,
      o.order_number,
      o.order_status,
      o.payment_status,
      o.total_amount,
      o.created_at,
      oi.quantity,
      oi.product_name,
      oi.selected_color,
      oi.selected_size,
      p.image
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    // Group items by order
    const orders = {};
    results.forEach(row => {
      if (!orders[row.id]) {
        orders[row.id] = {
          id: row.id,
          order_number: row.order_number,
          order_status: row.order_status,
          payment_status: row.payment_status,
          total_amount: row.total_amount,
          created_at: row.created_at,
          items: []
        };
      }
      
      orders[row.id].items.push({
        product_name: row.product_name,
        quantity: row.quantity,
        selected_color: row.selected_color,
        selected_size: row.selected_size,
        image: row.image
      });
    });

    res.json(Object.values(orders));
  });
};

// Get order details
exports.getOrderDetails = (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.query; // For security, ensure user can only see their own orders

  const query = `
    SELECT 
      o.*,
      oi.*,
      p.image,
      p.description,
      ba.first_name as billing_first_name,
      ba.last_name as billing_last_name,
      ba.address_line1 as billing_address_line1,
      ba.city as billing_city,
      ba.state as billing_state,
      ba.postal_code as billing_postal_code,
      ba.country as billing_country,
      sa.first_name as shipping_first_name,
      sa.last_name as shipping_last_name,
      sa.address_line1 as shipping_address_line1,
      sa.city as shipping_city,
      sa.state as shipping_state,
      sa.postal_code as shipping_postal_code,
      sa.country as shipping_country,
      os.tracking_number,
      os.carrier,
      os.shipping_status,
      sm.name as shipping_method_name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    JOIN addresses ba ON o.billing_address_id = ba.id
    JOIN addresses sa ON o.shipping_address_id = sa.id
    LEFT JOIN order_shipping os ON o.id = os.order_id
    LEFT JOIN shipping_methods sm ON os.shipping_method_id = sm.id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(query, [orderId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = {
      id: results[0].id,
      order_number: results[0].order_number,
      order_status: results[0].order_status,
      payment_status: results[0].payment_status,
      subtotal: results[0].subtotal,
      tax_amount: results[0].tax_amount,
      shipping_amount: results[0].shipping_amount,
      discount_amount: results[0].discount_amount,
      total_amount: results[0].total_amount,
      created_at: results[0].created_at,
      notes: results[0].notes,
      billing_address: {
        first_name: results[0].billing_first_name,
        last_name: results[0].billing_last_name,
        address_line1: results[0].billing_address_line1,
        city: results[0].billing_city,
        state: results[0].billing_state,
        postal_code: results[0].billing_postal_code,
        country: results[0].billing_country
      },
      shipping_address: {
        first_name: results[0].shipping_first_name,
        last_name: results[0].shipping_last_name,
        address_line1: results[0].shipping_address_line1,
        city: results[0].shipping_city,
        state: results[0].shipping_state,
        postal_code: results[0].shipping_postal_code,
        country: results[0].shipping_country
      },
      shipping_info: {
        method: results[0].shipping_method_name,
        tracking_number: results[0].tracking_number,
        carrier: results[0].carrier,
        status: results[0].shipping_status
      },
      items: results.map(row => ({
        product_name: row.product_name,
        product_sku: row.product_sku,
        quantity: row.quantity,
        unit_price: row.unit_price,
        total_price: row.total_price,
        selected_color: row.selected_color,
        selected_size: row.selected_size,
        image: row.image,
        description: row.description
      }))
    };

    res.json(order);
  });
};

// Update order status (admin function)
exports.updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  const { order_status, payment_status, tracking_number, carrier } = req.body;

  const updateData = {};
  if (order_status) updateData.order_status = order_status;
  if (payment_status) updateData.payment_status = payment_status;

  if (Object.keys(updateData).length > 0) {
    db.query(
      "UPDATE orders SET ? WHERE id = ?",
      [updateData, orderId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to update order" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order updated successfully" });
      }
    );
  }

  // Update shipping info if provided
  if (tracking_number || carrier) {
    const shippingUpdateData = {};
    if (tracking_number) shippingUpdateData.tracking_number = tracking_number;
    if (carrier) shippingUpdateData.carrier = carrier;

    db.query(
      "UPDATE order_shipping SET ? WHERE order_id = ?",
      [shippingUpdateData, orderId],
      (err) => {
        if (err) {
          console.error(err);
          // Don't fail the response for shipping update error
        }
      }
    );
  }
};

// Cancel order
exports.cancelOrder = (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  // Check if order belongs to user and can be cancelled
  db.query(
    "SELECT order_status FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = results[0];
      if (order.order_status !== 'pending' && order.order_status !== 'confirmed') {
        return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
      }

      // Update order status
      db.query(
        "UPDATE orders SET order_status = 'cancelled' WHERE id = ?",
        [orderId],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to cancel order" });
          }

          res.json({ message: "Order cancelled successfully" });
        }
      );
    }
  );
};
