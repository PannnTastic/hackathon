const express = require('express');
const router = express.Router();
const suaraController = require('../controllers/suaraController');
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

// Input Suara
router.post('/', authenticate, authorize(['penghitungan']), suaraController.inputSuara);

// Edit Suara
router.put('/:id', authenticate, authorize(['penghitungan']), suaraController.editSuara);

// Upload C6 for Suara
router.post('/upload-c6/:id', authenticate, authorize(['penghitungan']), upload.single('dokumen'), suaraController.uploadC6ForSuara);

// Grafik Total Suara (no login required)
router.get('/grafik', suaraController.grafikSuara);

// Get All Suara
router.get('/', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kecamatan', 'kelurahan']), suaraController.getSuara);

module.exports = router;
