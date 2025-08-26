const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Get user profile
router.get("/profile/:userId", userController.getUserProfile);

// Update user profile
router.put("/profile/:userId", userController.updateUserProfile);

// Change password
router.put("/:userId/password", userController.changePassword);

// Get user statistics
router.get("/:userId/stats", userController.getUserStats);

// Get user activity
router.get("/:userId/activity", userController.getUserActivity);

// Get user preferences
router.get("/:userId/preferences", userController.getUserPreferences);

// Update user preferences
router.put("/:userId/preferences", userController.updateUserPreferences);

// Delete user account
router.delete("/:userId", userController.deleteUserAccount);

module.exports = router; 