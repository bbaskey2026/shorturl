// auth.service.js - Production-Ready Layered Authentication & Token Rotation Logic
const crypto = require('crypto');
const authRepo = require('./auth.repository');
const tokenService = require('./token.service');
const passwordService = require('./password.service');
const authValidation = require('./auth.validation');

class AuthService {
  /**
   * Registers a new customer account.
   * Public registration always enforces the 'CUSTOMER' role.
   */
  async register({ name, fullName, email, password, confirmPassword }, meta = {}) {
    const validation = authValidation.validateRegister({ name, fullName, email, password, confirmPassword });
    if (!validation.valid) {
      const err = new Error(validation.message);
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await authRepo.findByEmail(normalizedEmail);
    if (existing) {
      const err = new Error('Email is already registered');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await passwordService.hash(password);
    const user = await authRepo.create({
      email: normalizedEmail,
      passwordHash,
      name: (name || fullName).trim(),
      role: 'CUSTOMER', // Strict: Public registration always creates CUSTOMER
      plan: 'free',
      status: 'ACTIVE',
    });

    // Create initial authenticated session with refresh token rotation family
    const session = await this._createSession(user, meta);

    await authRepo.logSecurityEvent({
      userId: user.id,
      action: 'USER_REGISTERED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { role: user.role, email: user.email },
    });

    const { password_hash, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  /**
   * Authenticates user credentials for Customer or Admin roles.
   * @param {Object} credentials - { email, password, roleRequirement }
   */
  async login({ email, password, roleRequirement = null }, meta = {}) {
    const validation = authValidation.validateLogin({ email, password });
    if (!validation.valid) {
      const err = new Error(validation.message);
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await authRepo.findByEmail(normalizedEmail);

    // Timing-attack safe generic credential rejection
    if (!user) {
      await authRepo.logSecurityEvent({
        action: 'LOGIN_FAILED',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: { reason: 'User not found', email: normalizedEmail },
      });
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    // Verify account status (ACTIVE, INACTIVE, SUSPENDED)
    if (user.status !== 'ACTIVE') {
      await authRepo.logSecurityEvent({
        userId: user.id,
        action: 'LOGIN_BLOCKED_STATUS',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: { status: user.status },
      });
      const err = new Error(`Account is ${user.status.toLowerCase()}. Please contact support.`);
      err.statusCode = 403;
      throw err;
    }

    // Verify password hash
    const isValidPassword = await passwordService.compare(password, user.password_hash);
    if (!isValidPassword) {
      await authRepo.logSecurityEvent({
        userId: user.id,
        action: 'LOGIN_FAILED',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: { reason: 'Password mismatch' },
      });
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    // Enforce role authorization if endpoint requires a specific role (e.g. Admin portal)
    if (roleRequirement && roleRequirement.toUpperCase() === 'ADMIN' && user.role !== 'ADMIN') {
      await authRepo.logSecurityEvent({
        userId: user.id,
        action: 'ADMIN_LOGIN_FORBIDDEN',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: { actualRole: user.role },
      });
      const err = new Error('Forbidden: Administrative privileges required');
      err.statusCode = 403;
      throw err;
    }

    // Create session and issue tokens
    const session = await this._createSession(user, meta);

    await authRepo.logSecurityEvent({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { role: user.role, sessionId: session.sessionId },
    });

    const { password_hash, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  /**
   * Refreshes an expired access token using a cryptographically secure refresh token.
   * Performs automatic refresh token rotation and token reuse detection.
   */
  async refresh({ rawRefreshToken }, meta = {}) {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      const err = new Error('Refresh token is required');
      err.statusCode = 401;
      throw err;
    }

    const tokenHash = tokenService.hashToken(rawRefreshToken);
    const tokenRecord = await authRepo.findRefreshTokenByHash(tokenHash);

    if (!tokenRecord) {
      const err = new Error('Invalid or non-existent refresh token');
      err.statusCode = 401;
      throw err;
    }

    // REFRESH TOKEN REUSE DETECTION:
    // If a token that was already replaced or revoked is presented again,
    // it indicates potential compromise or theft. Immediately revoke the entire token family.
    if (tokenRecord.revoked_at || tokenRecord.replaced_by_token_id) {
      await authRepo.revokeTokenFamily(tokenRecord.token_family_id);
      await authRepo.logSecurityEvent({
        userId: tokenRecord.user_id,
        action: 'REFRESH_TOKEN_REUSE_DETECTED',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: {
          compromisedFamilyId: tokenRecord.token_family_id,
          reusedTokenId: tokenRecord.id,
        },
      });

      const err = new Error('Invalid refresh token. Potential reuse detected; all sessions in this chain have been terminated.');
      err.statusCode = 401;
      err.code = 'TOKEN_REUSE_DETECTED';
      throw err;
    }

    // Verify expiration
    if (new Date(tokenRecord.expires_at) < new Date()) {
      await authRepo.revokeToken(tokenHash);
      const err = new Error('Refresh token has expired. Please log in again.');
      err.statusCode = 401;
      throw err;
    }

    // Verify user account status
    const user = await authRepo.findById(tokenRecord.user_id);
    if (!user || user.status !== 'ACTIVE') {
      await authRepo.revokeTokenFamily(tokenRecord.token_family_id);
      const err = new Error('Account is inactive or suspended');
      err.statusCode = 403;
      throw err;
    }

    // Atomic Token Rotation: Issue new refresh token and invalidate old one
    const newRefresh = tokenService.generateRefreshToken();
    await authRepo.rotateRefreshToken({
      oldTokenId: tokenRecord.id,
      oldTokenHash: tokenHash,
      newTokenHash: newRefresh.tokenHash,
      newExpiresAt: newRefresh.expiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      tokenFamilyId: tokenRecord.token_family_id,
      sessionId: tokenRecord.session_id,
      userId: user.id,
    });

    // Issue fresh short-lived access token
    const accessToken = tokenService.generateAccessToken(user, tokenRecord.session_id);

    await authRepo.logSecurityEvent({
      userId: user.id,
      action: 'TOKEN_ROTATED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    const { password_hash, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken: newRefresh.rawToken,
    };
  }

  /**
   * Logs out the current session by revoking its refresh token.
   */
  async logout({ rawRefreshToken }, meta = {}) {
    if (rawRefreshToken) {
      try {
        const tokenHash = tokenService.hashToken(rawRefreshToken);
        await authRepo.revokeToken(tokenHash);
      } catch {}
    }

    await authRepo.logSecurityEvent({
      action: 'LOGOUT',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Logs out all active sessions belonging to the user.
   */
  async logoutAll(userId, meta = {}) {
    await authRepo.revokeAllUserTokens(userId);
    await authRepo.logSecurityEvent({
      userId,
      action: 'LOGOUT_ALL_SESSIONS',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { success: true, message: 'All active sessions have been revoked' };
  }

  /**
   * Changes the user's password and revokes all active refresh tokens for security.
   */
  async changePassword(userId, { currentPassword, newPassword, confirmPassword }, meta = {}) {
    const validation = authValidation.validateChangePassword({ currentPassword, newPassword, confirmPassword });
    if (!validation.valid) {
      const err = new Error(validation.message);
      err.statusCode = 400;
      throw err;
    }

    const user = await authRepo.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const isValid = await passwordService.compare(currentPassword, user.password_hash);
    if (!isValid) {
      const err = new Error('Current password is incorrect');
      err.statusCode = 400;
      throw err;
    }

    const newHash = await passwordService.hash(newPassword);
    await authRepo.updatePassword(userId, newHash);

    // Invalidate all existing refresh tokens so other sessions must re-authenticate
    await authRepo.revokeAllUserTokens(userId);

    await authRepo.logSecurityEvent({
      userId,
      action: 'PASSWORD_CHANGED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Returns current authenticated user profile.
   */
  async getProfile(userId) {
    const user = await authRepo.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Helper to initiate a new session with an atomic token family.
   */
  async _createSession(user, meta = {}) {
    const sessionId = crypto.randomUUID();
    const tokenFamilyId = crypto.randomUUID();
    const refresh = tokenService.generateRefreshToken();

    await authRepo.createRefreshToken({
      userId: user.id,
      tokenHash: refresh.tokenHash,
      tokenFamilyId,
      sessionId,
      expiresAt: refresh.expiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    const accessToken = tokenService.generateAccessToken(user, sessionId);

    return {
      sessionId,
      accessToken,
      refreshToken: refresh.rawToken,
    };
  }
}

module.exports = new AuthService();
