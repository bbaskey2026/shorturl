// auth.validation.js - Input Validation for Authentication Endpoints
const passwordService = require('./password.service');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthValidation {
  validateRegister(body = {}) {
    const { name, fullName, email, password, confirmPassword, role } = body;
    const displayName = name || fullName;

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return { valid: false, message: 'Name is required' };
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return { valid: false, message: 'A valid email address is required' };
    }

    const strength = passwordService.validateStrength(password);
    if (!strength.valid) {
      return strength;
    }

    if (confirmPassword !== undefined && confirmPassword !== password) {
      return { valid: false, message: 'Password confirmation does not match' };
    }

    // Security requirement: Never allow client to specify or escalate to ADMIN role during public registration
    if (role && (role.toUpperCase() === 'ADMIN' || role.toLowerCase() === 'admin')) {
      return { valid: false, message: 'Administrative registration is not publicly permitted' };
    }

    return { valid: true };
  }

  validateLogin(body = {}) {
    const { email, password } = body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return { valid: false, message: 'A valid email address is required' };
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
      return { valid: false, message: 'Password is required' };
    }
    return { valid: true };
  }

  validateChangePassword(body = {}) {
    const { currentPassword, newPassword, confirmPassword } = body;
    if (!currentPassword || typeof currentPassword !== 'string') {
      return { valid: false, message: 'Current password is required' };
    }
    const strength = passwordService.validateStrength(newPassword);
    if (!strength.valid) {
      return strength;
    }
    if (currentPassword === newPassword) {
      return { valid: false, message: 'New password cannot be identical to the current password' };
    }
    if (confirmPassword !== undefined && confirmPassword !== newPassword) {
      return { valid: false, message: 'New password confirmation does not match' };
    }
    return { valid: true };
  }
}

module.exports = new AuthValidation();

