// auth.controller.js - Unified Authentication Controller for Customer & Admin
const authService = require('./auth.service');
const jwtConfig = require('../../config/jwt.config');
const { success, error } = require('../../utils/response');

class AuthController {
  _extractMeta(req) {
    return {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'] || null,
    };
  }

  _extractRefreshToken(req) {
    if (req.cookies && req.cookies[jwtConfig.cookieName]) {
      return req.cookies[jwtConfig.cookieName];
    }
    if (req.body && req.body.refreshToken) {
      return req.body.refreshToken;
    }
    return null;
  }

  _setRefreshCookie(res, token) {
    if (typeof res.setCookie === 'function') {
      res.setCookie(jwtConfig.cookieName, token, jwtConfig.cookieOptions);
    } else if (typeof res.cookie === 'function') {
      res.cookie(jwtConfig.cookieName, token, jwtConfig.cookieOptions);
    }
  }

  _clearRefreshCookie(res) {
    if (typeof res.clearCookie === 'function') {
      res.clearCookie(jwtConfig.cookieName, jwtConfig.cookieOptions);
    }
  }

  /**
   * Customer Registration (Public)
   * POST /api/v1/auth/register
   */
  async register(req, res, next) {
    try {
      const meta = this._extractMeta(req);
      const result = await authService.register(req.body, meta);

      // Attach secure HttpOnly refresh token cookie
      this._setRefreshCookie(res, result.refreshToken);

      return success(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken, // Also returned in JSON for API/mobile clients
        },
        201
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Customer Login
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const meta = this._extractMeta(req);
      const result = await authService.login(req.body, meta);

      this._setRefreshCookie(res, result.refreshToken);

      return success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin Login
   * POST /api/v1/admin/auth/login
   */
  async adminLogin(req, res, next) {
    try {
      const meta = this._extractMeta(req);
      const result = await authService.login(
        { ...req.body, roleRequirement: 'ADMIN' },
        meta
      );

      this._setRefreshCookie(res, result.refreshToken);

      return success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh Token Endpoint (Customer & Admin)
   * POST /api/v1/auth/refresh and POST /api/v1/admin/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const rawRefreshToken = this._extractRefreshToken(req);
      if (!rawRefreshToken) {
        return error(res, 'Refresh token required in cookie or request body', 401);
      }

      const meta = this._extractMeta(req);
      const result = await authService.refresh({ rawRefreshToken }, meta);

      // Rotate cookie with the newly issued token
      this._setRefreshCookie(res, result.refreshToken);

      return success(res, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }, 200);
    } catch (err) {
      // Clear compromised/invalid cookie on refresh failure
      this._clearRefreshCookie(res);
      next(err);
    }
  }

  /**
   * Logout current session
   * POST /api/v1/auth/logout and POST /api/v1/admin/auth/logout
   */
  async logout(req, res, next) {
    try {
      const rawRefreshToken = this._extractRefreshToken(req);
      const meta = this._extractMeta(req);

      await authService.logout({ rawRefreshToken }, meta);
      this._clearRefreshCookie(res);

      return success(res, { message: 'Logged out successfully' }, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logout all sessions for user
   * POST /api/v1/auth/logout-all and POST /api/v1/admin/auth/logout-all
   */
  async logoutAll(req, res, next) {
    try {
      const meta = this._extractMeta(req);
      await authService.logoutAll(req.user.id, meta);
      this._clearRefreshCookie(res);

      return success(res, { message: 'All active sessions revoked successfully' }, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Current User Profile
   * GET /api/v1/auth/me and GET /api/v1/admin/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return success(res, user, 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change Password
   * POST /api/v1/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const meta = this._extractMeta(req);
      const result = await authService.changePassword(req.user.id, req.body, meta);
      this._clearRefreshCookie(res);
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  // Alias for backwards compatibility
  async getProfile(req, res, next) {
    return this.getMe(req, res, next);
  }
}

module.exports = new AuthController();
