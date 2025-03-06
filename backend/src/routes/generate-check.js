'use strict';

const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');
const { verifyToken, authorizeUserLevels } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorizeUserLevels(99), cronController.scheduleJobsApi);

module.exports = router;
