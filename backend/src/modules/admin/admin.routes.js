// admin.routes.js
const { Router } = require('express');
const adminController = require('./admin.controller');
const { authenticate, requireRole } = require('../../middleware/auth.middleware');

const router = Router();
router.use(authenticate, requireRole('admin'));

router.get('/dashboard', (req, res, next) => adminController.getDashboard(req, res, next));

module.exports = router;

