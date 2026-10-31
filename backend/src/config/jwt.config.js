// jwt.config.js
module.exports = {
  secret: process.env.JWT_SECRET || 'shorturl-super-secret-jwt-key-2026-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'shorturl-refresh-secret-jwt-key-2026',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

