const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create Laporan
router.post('/', authenticate, authorize(['kelurahan', 'kabupaten']), laporanController.createLaporan);

// Get All Laporan
router.get('/', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kelurahan']), laporanController.getLaporan);

// Update Laporan Status
router.put('/:id', authenticate, authorize(['kabupaten']), laporanController.updateLaporan);

module.exports = router;
 