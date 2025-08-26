const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// Add item to cart
router.post("/add", cartController.addToCart);

// Get user's cart
router.get("/:userId", cartController.getCart);

// Update cart item quantity
router.put("/item/:cartItemId", cartController.updateCartItem);

// Remove item from cart
router.delete("/item/:cartItemId", cartController.removeFromCart);

// Clear user's entire cart
router.delete("/:userId", cartController.clearCart);

// Get cart count for navbar badge
router.get("/count/:userId", cartController.getCartCount);

module.exports = router;
