// analytics.routes.js
const { Router } = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = Router();
router.use(authenticate);

router.get('/overview', (req, res, next) => analyticsController.getOverview(req, res, next));

module.exports = router;

