// jwt.config.js - Centralized JWT & Session Security Configuration
module.exports = {
  secret: process.env.JWT_SECRET || 'shorturl-production-access-token-secret-2026',
  expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresDays: parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || '30', 10),
  issuer: process.env.JWT_ISSUER || 'url-shortener-api',
  audience: process.env.JWT_AUDIENCE || 'url-shortener-client',
  cookieName: process.env.JWT_COOKIE_NAME || 'jwt_refresh',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || '30', 10) * 24 * 60 * 60 * 1000,
  },
};
