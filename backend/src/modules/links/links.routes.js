// links.routes.js
const { Router } = require('express');
const linksController = require('./links.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { rateLimiter } = require('../../middleware/rateLimiter.middleware');

const router = Router();

// Protect all link operations
router.use(authenticate);

router.post('/', rateLimiter({ max: 60 }), (req, res, next) => linksController.create(req, res, next));
router.get('/', (req, res, next) => linksController.getAll(req, res, next));
router.get('/:id', (req, res, next) => linksController.getOne(req, res, next));
router.patch('/:id', (req, res, next) => linksController.update(req, res, next));
router.delete('/:id', (req, res, next) => linksController.delete(req, res, next));

module.exports = router;

