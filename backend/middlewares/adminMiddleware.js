module.exports = function requireAdmin(req, res, next) {
  if (!req.userRole || req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
