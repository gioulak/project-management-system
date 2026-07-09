const { verifyToken } = require('../utils/jwt');

// Verify JWT token
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Check if user is team leader or admin
const isLeaderOrAdmin = (req, res, next) => {
  if (req.user.role !== 'TEAM_LEADER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Team Leader or Admin only.' });
  }
  next();
};

module.exports = { authenticate, isAdmin, isLeaderOrAdmin };
