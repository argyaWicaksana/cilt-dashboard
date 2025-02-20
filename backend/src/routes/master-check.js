'use strict';

const express = require('express');
const router = express.Router();
const masterCheckController = require('../controllers/masterCheckController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, masterCheckController.getAllMasterCheck);
router.post('/', verifyToken, masterCheckController.createMasterCheck);
router.put('/:id', verifyToken, masterCheckController.updateMasterCheck);
router.delete('/:id', verifyToken, masterCheckController.deleteMasterCheck);

router.get('/current-cycle', verifyToken, masterCheckController.getCurrentCycle);

module.exports = router;