const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

// Apply auth middleware to all order routes
router.use(authMiddleware);

// Create new order
router.post("/create", orderController.createOrder);

// Get user's orders
router.get("/user/:userId", orderController.getUserOrders);

// Get order details
router.get("/:orderId", orderController.getOrderDetails);

// Update order status (admin function)
router.put("/:orderId/status", requireAdmin, orderController.updateOrderStatus);

// Cancel order
router.put("/:orderId/cancel", orderController.cancelOrder);

module.exports = router;
