'use strict';

const express = require('express');
const router = express.Router();
const finishedCheckController = require('../controllers/finishedCheckController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.get('/', verifyToken, finishedCheckController.getAllFinishedCheck);
router.get('/progress/:monthYear', verifyToken, finishedCheckController.getProgressCheck);

module.exports = router;