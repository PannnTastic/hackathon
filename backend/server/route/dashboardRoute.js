const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const publicController = require ('../controllers/publicController')

router.get('/', dashboardController.getDashboardSummary);

module.exports = router;
