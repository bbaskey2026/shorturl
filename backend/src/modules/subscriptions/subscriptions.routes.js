// subscriptions.routes.js
const { Router } = require('express');
const subController = require('./subscriptions.controller');
const { authenticate, optionalAuth } = require('../../middleware/auth.middleware');

const router = Router();

router.get('/plans', optionalAuth, (req, res) => subController.getPlans(req, res));
router.get('/usage', authenticate, (req, res, next) => subController.getUsage(req, res, next));
router.post('/upgrade', authenticate, (req, res, next) => subController.upgrade(req, res, next));

module.exports = router;

