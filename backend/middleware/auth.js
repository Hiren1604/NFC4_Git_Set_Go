const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'w2MkhGnIM5i1VsowlEYnVBLgCIqgGh3dGDBPehLhvr0';

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ error: 'User not found' });
      if (!req.user.isActive) return res.status(401).json({ error: 'User account is deactivated' });
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }
  if (!token) return res.status(401).json({ error: 'Not authorized, no token' });
};

// Authorize roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }
    next();
  };
};

// Generate JWT token
const generateToken = (id) => {
  const expiresIn = '7d';
  return jwt.sign({ id }, JWT_SECRET, { expiresIn });
};

module.exports = { protect, authorize, generateToken }; 