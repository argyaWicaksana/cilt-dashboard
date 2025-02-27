'use strict';

const express = require('express');
const router = express.Router();
const stopCycleController = require('../controllers/stopCycleController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, stopCycleController.getAllCycleNote);
router.post('/', verifyToken, stopCycleController.createCycleNote);
router.put('/:id', verifyToken, stopCycleController.updateCycleNote);
router.delete('/:id', verifyToken, stopCycleController.deleteCycleNote);

module.exports = router;