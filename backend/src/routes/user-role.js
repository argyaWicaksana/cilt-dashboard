'use strict';

const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, userRoleController.getAllTableUser);
router.post('/', verifyToken, userRoleController.createTableUser);
router.put('/:id', verifyToken, userRoleController.updateTableUser);
router.delete('/:id', verifyToken, userRoleController.deleteTableUser);

module.exports = router;
