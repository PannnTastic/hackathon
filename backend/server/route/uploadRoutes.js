const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/c6'); // Save files in the 'uploads/c6' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid filename conflicts
    },
});
const upload = multer({ storage });

router.post('/upload-pemilih', authenticate, authorize(['pendataan']), uploadController.uploadPemilih);
router.post('/upload-foto', authenticate, authorize(['pendataan']), uploadController.uploadFoto);

// Upload Dokumen C6 (with file upload)
router.post('/upload-c6', authenticate, authorize(['pendataan']), upload.single('dokumen'), uploadController.uploadC6);

router.put('/validasi-c6/:id', authenticate, authorize(['kabupaten']), uploadController.validasiC6);
router.put('/update-c6/:id', authenticate, authorize(['kabupaten']), uploadController.updateC6);

module.exports = router;
