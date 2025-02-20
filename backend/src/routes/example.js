'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/exampleController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, controller.createExample);
router.get('/', verifyToken, controller.getAllExample);
router.get('/:id', verifyToken, controller.getExampleById);
router.put('/:id', verifyToken, controller.updateExample);
router.delete('/:id', verifyToken, controller.deleteExample);
router.delete('/bulk/:ids', verifyToken, controller.deleteBulkExample);

module.exports = router;