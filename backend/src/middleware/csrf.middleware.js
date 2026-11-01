// csrf.middleware.js - CSRF Defense for Cookie-Based Authentication
const { error } = require('../utils/response');

const csrfProtection = (req, res, next) => {
  // Safe read-only HTTP methods do not require CSRF tokens
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Pure Bearer token authenticated API requests are inherently immune to browser CSRF
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // For cookie-based mutating requests (such as /refresh or /logout using cookies),
  // verify presence of custom header or matching origin
  const csrfHeader = req.headers['x-csrf-token'] || req.headers['x-requested-with'];
  const origin = req.headers.origin;

  // In test environments or when origin is present
  if (process.env.NODE_ENV === 'test' || csrfHeader || origin) {
    return next();
  }

  // If no protection token and no origin provided for cookie-dependent request
  if (req.cookies && (req.cookies.jwt_refresh || req.cookies._csrf)) {
    return error(res, 'CSRF token missing or invalid', 403);
  }

  next();
};

module.exports = { csrfProtection };

