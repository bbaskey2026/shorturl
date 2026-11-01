// token.service.js - JWT Access Token & Cryptographic Refresh Token Management
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtConfig = require('../../config/jwt.config');

class TokenService {
  /**
   * Generates a signed, stateless JWT access token.
   * @param {Object} user - User record (id, role, email, name, plan)
   * @param {string} [sessionId] - Associated user session ID
   */
  generateAccessToken(user, sessionId = null) {
    const payload = {
      sub: user.id,
      role: user.role, // 'CUSTOMER' or 'ADMIN'
      email: user.email,
      name: user.name || user.full_name || '',
      plan: user.plan || 'free',
      sessionId: sessionId || undefined,
    };

    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  }

  /**
   * Verifies and decodes a JWT access token.
   * @param {string} token
   * @returns {Object} decoded claims
   */
  verifyAccessToken(token) {
    if (!token) {
      const err = new Error('No token provided');
      err.statusCode = 401;
      throw err;
    }

    try {
      return jwt.verify(token, jwtConfig.secret, {
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const expiredErr = new Error('Access token has expired');
        expiredErr.statusCode = 401;
        expiredErr.code = 'TOKEN_EXPIRED';
        throw expiredErr;
      }
      const invalidErr = new Error('Invalid or malformed access token');
      invalidErr.statusCode = 401;
      invalidErr.code = 'TOKEN_INVALID';
      throw invalidErr;
    }
  }

  /**
   * Generates a cryptographically random refresh token and its SHA-256 hash.
   * Only the hash will be stored in PostgreSQL.
   */
  generateRefreshToken() {
    const rawToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + jwtConfig.refreshExpiresDays * 24 * 60 * 60 * 1000);

    return {
      rawToken,
      tokenHash,
      expiresAt,
    };
  }

  /**
   * Deterministically computes the SHA-256 hash of a raw refresh token.
   * @param {string} rawToken
   */
  hashToken(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new Error('Raw token must be a non-empty string');
    }
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }
}

module.exports = new TokenService();

