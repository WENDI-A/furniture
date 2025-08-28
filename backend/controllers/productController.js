const db = require("../db");

// Fix known misspelled image filenames coming from the database
const IMAGE_FIXES = {
  "LoungChair.jpg": "LoungeChair.jpg",
  "StramlinedTable.jpg": "StreamlinedTable.jpg",
  "CoffeTable.jpg": "Coffee Table.jpg",
};

// Get all products
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    const fixed = results.map((r) => ({ ...r, image: IMAGE_FIXES[r.image] || r.image }));
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

// Admin: Create a product
exports.createProduct = (req, res) => {
  const {
    sku,
    title,
    short_description,
    description,
    category,
    company,
    price,
    image,
    is_active = true,
    is_featured = false,
  } = req.body;

  if (!sku || !title || !price) {
    return res.status(400).json({ error: "Missing required fields: sku, title, price" });
  }

  const insert = {
    sku,
    title,
    short_description: short_description || null,
    description: description || null,
    category: category || null,
    company: company || null,
    price,
    image: image || null,
    is_active: !!is_active,
    is_featured: !!is_featured,
  };

  db.query("INSERT INTO products SET ?", insert, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create product" });
    }
    res.status(201).json({ id: result.insertId, ...insert });
  });
};

// Admin: Update a product
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const update = req.body || {};
  if (update.image) {
    update.image = update.image; // no-op, image served from Assets
  }
  db.query("UPDATE products SET ? WHERE id = ?", [update, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update product" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated" });
  });
};

// Admin: Delete a product
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete product" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  });
};
