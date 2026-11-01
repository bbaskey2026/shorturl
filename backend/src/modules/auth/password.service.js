// password.service.js - Secure Password Hashing & Verification
const bcrypt = require('bcryptjs');

class PasswordService {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async compare(password, hash) {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
  }

  validateStrength(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain both letters and numbers' };
    }
    return { valid: true };
  }
}

module.exports = new PasswordService();

