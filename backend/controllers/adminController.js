const db = require("../db");

exports.listUsers = (req, res) => {
  const q = "SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC";
  db.query(q, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

exports.setUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role || !["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  db.query("UPDATE users SET role=? WHERE id=?", [role, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update role" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Role updated" });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  // Consider cascading or handling FK constraints appropriately
  db.query("DELETE FROM users WHERE id=?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  });
};
