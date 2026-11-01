// auth.middleware.js - JWT Authentication & Role-Based Authorization
const tokenService = require('../modules/auth/token.service');
const authRepo = require('../modules/auth/auth.repository');
const { error } = require('../utils/response');

/**
 * Middleware: Verifies the JWT Access Token from the Authorization header.
 * Validates issuer, audience, signature, expiration, and user account status.
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication required. Missing Bearer token.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = tokenService.verifyAccessToken(token);

    // Verify account active status
    const user = await authRepo.findById(decoded.sub);
    if (!user) {
      return error(res, 'User account no longer exists.', 401);
    }
    if (user.status !== 'ACTIVE') {
      return error(res, `Account is ${user.status.toLowerCase()}. Access denied.`, 403);
    }

    // Attach verified user payload to request
    req.user = {
      id: user.id,
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // 'CUSTOMER' or 'ADMIN'
      plan: user.plan,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (err) {
    if (err.code === 'TOKEN_EXPIRED') {
      return error(res, 'Access token has expired. Please refresh your session.', 401);
    }
    return error(res, 'Invalid or malformed authentication token.', 401);
  }
};

/**
 * Middleware: Restricts access to users with specified role(s).
 * @param  {...string} roles - e.g. 'ADMIN', 'CUSTOMER'
 */
const authorizeRoles = (...roles) => {
  const normalizedRoles = roles.map((r) => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required.', 401);
    }

    if (!normalizedRoles.includes(req.user.role.toUpperCase())) {
      return error(res, 'Forbidden: Insufficient permissions for this resource.', 403);
    }

    next();
  };
};

/**
 * Optional authentication: populates req.user if a valid token is present,
 * but allows public requests if absent.
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = tokenService.verifyAccessToken(token);
      req.user = {
        id: decoded.sub,
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        plan: decoded.plan,
      };
    } catch {}
  }
  next();
};

// Aliases for backwards compatibility with existing codebase
const authenticate = authenticateToken;
const requireRole = authorizeRoles;

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth,
  authenticate,
  requireRole,
};
