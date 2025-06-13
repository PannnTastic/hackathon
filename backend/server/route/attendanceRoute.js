const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceConttroller');
const {authenticateToken} = require('../middleware/authMiddleware');

router.post('/', authenticateToken, attendanceController.createAttendance);

router.get('/', authenticateToken, attendanceController.readAttendance);

module.exports = router;