// folders.routes.js
const { Router } = require('express');
const foldersController = require('./folders.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = Router();
router.use(authenticate);

router.get('/', (req, res, next) => foldersController.getAll(req, res, next));
router.post('/', (req, res, next) => foldersController.create(req, res, next));
router.delete('/:id', (req, res, next) => foldersController.delete(req, res, next));

module.exports = router;

