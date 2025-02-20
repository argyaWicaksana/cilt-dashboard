'use strict';

const express = require('express');
const router = express.Router();
const expiredCheckController = require('../controllers/expiredCheckController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, expiredCheckController.getAllExpiredCheck);
router.post('/', verifyToken, expiredCheckController.reactivateCheck);

module.exports = router;