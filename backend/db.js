const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "furniture"
});

db.connect(function(err) {
  if (err) throw err;
  else console.log("Connected!");
});

module.exports = db;