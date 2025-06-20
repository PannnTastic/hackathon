const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.get('/', authenticateToken, reportController.readReports);
router.put('/:id', authenticateToken, reportController.updateReportStatus);

module.exports = router;