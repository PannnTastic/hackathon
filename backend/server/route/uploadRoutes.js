const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Upload Data Pemilih By TPS
router.post('/upload-pemilih', authenticate, authorize(['pendataan']), uploadController.uploadPemilih);

// Upload Foto Pemilih
router.post('/upload-foto', authenticate, authorize(['pendataan']), uploadController.uploadFoto);

// Upload Dokumen C6
router.post('/upload-c6', authenticate, authorize(['pendataan']), uploadController.uploadC6);

// Validasi Dokumen C6
router.put('/validasi-c6/:id', authenticate, authorize(['kabupaten']), uploadController.validasiC6);

// Update Dokumen C6
router.put('/update-c6/:id', authenticate, authorize(['kabupaten']), uploadController.updateC6);

module.exports = router;
