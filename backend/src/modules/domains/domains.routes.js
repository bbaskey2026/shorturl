// domains.routes.js
const { Router } = require('express');
const domainsController = require('./domains.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = Router();
router.use(authenticate);

router.post('/', (req, res, next) => domainsController.add(req, res, next));
router.get('/', (req, res, next) => domainsController.getAll(req, res, next));
router.post('/:id/verify', (req, res, next) => domainsController.verify(req, res, next));
router.patch('/:id/default', (req, res, next) => domainsController.setDefault(req, res, next));
router.delete('/:id', (req, res, next) => domainsController.delete(req, res, next));

module.exports = router;

