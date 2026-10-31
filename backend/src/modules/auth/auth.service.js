// auth.service.js - Business logic for authentication
const jwt = require('jsonwebtoken');
const authRepo = require('./auth.repository');
const { hashPassword, comparePassword } = require('../../utils/hash');
const jwtConfig = require('../../config/jwt.config');

class AuthService {
  async register({ email, password, fullName }) {
    const existing = await authRepo.findByEmail(email);
    if (existing) {
      const err = new Error('Email is already registered');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepo.create({
      email,
      passwordHash,
      fullName: fullName || email.split('@')[0],
      role: 'user',
      plan: 'free',
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await authRepo.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    // Strip password hash from returned object
    const { password_hash, ...safeUser } = user;
    const token = this.generateToken(safeUser);
    return { user: safeUser, token };
  }

  async getProfile(userId) {
    const user = await authRepo.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
  }
}

module.exports = new AuthService();

