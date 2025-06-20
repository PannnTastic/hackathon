const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboardSummary);
router.post('/', publicController.createPublicReport);

module.exports = router;