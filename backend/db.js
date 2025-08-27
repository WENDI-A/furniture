const mysql = require("mysql2");

// Use a pooled connection to avoid 'closed state' errors and handle concurrency
const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "furniture",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

pool.getConnection((err, connection) => {
	if (err) {
		console.error("MySQL connection error:", err);
		return;
	}
	console.log("Connected!");
	connection.release();
});

module.exports = pool;