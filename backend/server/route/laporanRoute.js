const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

// Create Laporan (no login required)
router.post('/', laporanController.createLaporan);

module.exports = router;
