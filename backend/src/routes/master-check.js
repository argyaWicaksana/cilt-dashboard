'use strict';

const express = require('express');
const router = express.Router();
const masterCheckController = require('../controllers/masterCheckController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, masterCheckController.getAllMasterCheck);
router.post('/', masterCheckController.createMasterCheck);
router.put('/:id', masterCheckController.updateMasterCheck);
router.delete('/:id', masterCheckController.deleteMasterCheck);

module.exports = router;