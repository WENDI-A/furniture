const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

// Public: GET all products
router.get("/", productController.getAllProducts);

// Public: GET single product by ID
router.get("/:id", productController.getProductById);

// Admin-protected product management routes
router.post("/", authMiddleware, requireAdmin, productController.createProduct);
router.put("/:id", authMiddleware, requireAdmin, productController.updateProduct);
router.delete("/:id", authMiddleware, requireAdmin, productController.deleteProduct);

module.exports = router;
