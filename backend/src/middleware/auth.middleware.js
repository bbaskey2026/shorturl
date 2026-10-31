// auth.middleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication required. Missing Bearer token.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded; // { id, email, role, plan }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired. Please refresh session.', 401);
    }
    return error(res, 'Invalid authentication token.', 401);
  }
};

// Optional auth (for public endpoints that can be enhanced if logged in)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, jwtConfig.secret);
    } catch {}
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 'Forbidden. Insufficient permissions for this resource.', 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
};

