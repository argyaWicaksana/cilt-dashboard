'use strict';

const express = require('express');
const router = express.Router();
const taskCheckController = require('../controllers/taskCheckController');
const { verifyToken } = require('../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', verifyToken, taskCheckController.getAllTaskCheck);
router.put('/', verifyToken, upload.any(), taskCheckController.createReport);

module.exports = router;
