const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply auth middleware to all address routes
router.use(authMiddleware);

// Get user's addresses
router.get("/user/:userId", addressController.getUserAddresses);

// Add new address
router.post("/add", addressController.addAddress);

// Update address
router.put("/:addressId", addressController.updateAddress);

// Delete address
router.delete("/:addressId", addressController.deleteAddress);

// Set default address
router.put("/:addressId/default", addressController.setDefaultAddress);

// Get default address
router.get("/user/:userId/default", addressController.getDefaultAddress);

// Validate address format
router.post("/validate", addressController.validateAddress);

module.exports = router; 