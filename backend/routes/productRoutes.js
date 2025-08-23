const express = require("express");
const router = express.Router();

// Temporary test route
router.get("/", (req, res) => {
  res.send("Product route works");
});

module.exports = router; // ✅ must export router
