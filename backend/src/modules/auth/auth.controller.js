// auth.controller.js
const authService = require('./auth.service');
const { success, error } = require('../../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password) {
        return error(res, 'Email and password are required', 400);
      }
      if (password.length < 6) {
        return error(res, 'Password must be at least 6 characters', 400);
      }

      const result = await authService.register({ email, password, fullName });
      return success(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return error(res, 'Email and password are required', 400);
      }

      const result = await authService.login({ email, password });
      return success(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return success(res, user, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();

