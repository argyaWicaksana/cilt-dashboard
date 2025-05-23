'use strict';

const express = require('express');
const router = express.Router();
const mappingUserAreaController = require('../controllers/mappingUserAreaController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, mappingUserAreaController.getAllMappingUserArea);
router.post('/', verifyToken, mappingUserAreaController.createMappingUserArea);
router.put('/:id', verifyToken, mappingUserAreaController.updateMappingUserArea);
router.delete('/:id', verifyToken, mappingUserAreaController.deleteMappingUserArea);

module.exports = router;
