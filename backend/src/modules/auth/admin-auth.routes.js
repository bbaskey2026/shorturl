// admin-auth.routes.js - Admin Specific Authentication Routes
const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');
const { rateLimiter } = require('../../middleware/rateLimiter.middleware');
const { csrfProtection } = require('../../middleware/csrf.middleware');

const router = Router();

// Strict rate limit for admin login attempts: 10 attempts per 15 minutes
const adminRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
const refreshRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 });

// Admin Login (Requires ADMIN role verification)
router.post('/login', adminRateLimiter, (req, res, next) => authController.adminLogin(req, res, next));
router.post('/refresh', refreshRateLimiter, csrfProtection, (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', csrfProtection, (req, res, next) => authController.logout(req, res, next));

// Admin Protected Operations (Requires valid token AND 'ADMIN' role)
router.get('/me', authenticateToken, authorizeRoles('ADMIN'), (req, res, next) => authController.getMe(req, res, next));
router.post('/logout-all', authenticateToken, authorizeRoles('ADMIN'), (req, res, next) => authController.logoutAll(req, res, next));

module.exports = router;

