// auth.routes.js
const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { rateLimiter } = require('../../middleware/rateLimiter.middleware');

const router = Router();

// Rate limit login/register to 20 attempts per 15 mins to prevent brute-force
const authRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

router.post('/register', authRateLimiter, (req, res, next) => authController.register(req, res, next));
router.post('/login', authRateLimiter, (req, res, next) => authController.login(req, res, next));
router.get('/profile', authenticate, (req, res, next) => authController.getProfile(req, res, next));

module.exports = router;

