const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  let token = authHeader;
  if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.slice(7).trim();
  }

  if (!token) return res.status(401).json({ message: "No token provided" });

  const secret = process.env.JWT_SECRET || "SECRET_KEY";
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.id;
    req.userRole = decoded.role || 'user';
    next();
  });
};

module.exports = authMiddleware;
