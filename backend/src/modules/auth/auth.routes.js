// auth.routes.js - Customer Authentication Routes
const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');
const { rateLimiter } = require('../../middleware/rateLimiter.middleware');
const { csrfProtection } = require('../../middleware/csrf.middleware');

const router = Router();

// Rate limiting: 20 attempts per 15 minutes to deter brute force attacks
const authRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });
// Refresh rate limiting: 60 requests per 15 minutes
const refreshRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 });

// Customer Public Authentication
router.post('/register', authRateLimiter, (req, res, next) => authController.register(req, res, next));
router.post('/login', authRateLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/refresh', refreshRateLimiter, csrfProtection, (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', csrfProtection, (req, res, next) => authController.logout(req, res, next));

// Customer Protected Operations
router.get('/me', authenticateToken, (req, res, next) => authController.getMe(req, res, next));
router.get('/profile', authenticateToken, (req, res, next) => authController.getMe(req, res, next)); // Backwards compatibility
router.post('/change-password', authenticateToken, (req, res, next) => authController.changePassword(req, res, next));
router.post('/logout-all', authenticateToken, (req, res, next) => authController.logoutAll(req, res, next));

module.exports = router;
