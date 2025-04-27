const express = require('express');
const router = express.Router();
const pemilihController = require('../controllers/pemilihController'); // Import pemilihController
const suaraController = require('../controllers/suaraController'); // Import suaraController
const { authenticate, isPendataan,isPenghitungan } = require('../middleware/authMiddleware');

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

// Upload C6 for Suara
router.post('/upload-c6/:id', authenticate, isPenghitungan, upload.single('dokumen'), suaraController.uploadC6ForSuara);

router.post('/suara',authenticate,isPenghitungan, suaraController.inputSuara);

// CRUD for Pemilih (restricted to pendataan role)
router.post('/pemilih', authenticate, isPendataan, pemilihController.createPemilih);
router.get('/pemilih', authenticate, isPendataan, pemilihController.getPemilih);
router.put('/pemilih/:id', authenticate, isPendataan, pemilihController.updatePemilih);
router.delete('/pemilih/:id', authenticate, isPendataan, pemilihController.deletePemilih);

module.exports = router;
