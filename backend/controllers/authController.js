const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
           [name, email, hashedPassword], 
           (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User registered", userId: result.insertId });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, userId: user.id });
  });
};
