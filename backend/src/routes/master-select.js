'use strict';

const express = require('express');
const router = express.Router();
const masterSelectController = require('../controllers/masterSelectController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/section', verifyToken, masterSelectController.getAllSections);
router.get('/sub-section', verifyToken, masterSelectController.getAllSubSections);
router.get('/location', verifyToken, masterSelectController.getAllLocations);
router.get('/cycle', verifyToken, masterSelectController.getAllCycles);

module.exports = router;
