const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

// All admin routes require auth + admin
router.use(authMiddleware, requireAdmin);

// Users management
router.get("/users", adminController.listUsers);
router.patch("/users/:id/role", adminController.setUserRole);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
