const db = require("../db");

// Fix known misspelled image filenames coming from the database
const IMAGE_FIXES = {
  "LoungChair.jpg": "LoungeChair.jpg",
  "StramlinedTable.jpg": "StreamlinedTable.jpg",
  "CoffeTable.jpg": "Coffee Table.jpg"
};

// Get all products
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    const fixed = results.map(r => ({ ...r, image: IMAGE_FIXES[r.image] || r.image }));
    res.json(fixed);
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
    const prod = results[0];
    prod.image = IMAGE_FIXES[prod.image] || prod.image;
    res.json(prod);
  });
};
