const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
	try {
		const { name, first_name, last_name, email, password } = req.body;
		// Support either full name or first/last
		const derivedFirst = first_name || (name ? name.split(" ")[0] : null);
		const derivedLast = last_name || (name ? name.split(" ").slice(1).join(" ") : "");
		if (!derivedFirst || !email || !password) {
			return res.status(400).json({ message: "first_name (or name), email and password are required" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
		db.query(sql, [derivedFirst, derivedLast, email, hashedPassword], (err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Database error", error: err });
			}
			return res.json({ message: "User registered", userId: result.insertId, name: derivedFirst });
		});
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: "Server error" });
	}
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
		if (err) return res.status(500).json(err);
		if (result.length === 0) return res.status(400).json({ message: "User not found" });

		const user = result[0];
		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(400).json({ message: "Wrong password" });

		const secret = process.env.JWT_SECRET || "SECRET_KEY";
		const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });
		res.json({ token, userId: user.id, name: user.first_name || user.name });
	});
};
