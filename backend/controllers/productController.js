const db = require("../db");

// Get all products
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Get single product by ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
};
