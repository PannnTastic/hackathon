const express = require('express');
const router = express.Router();
const suaraController = require('../controllers/suaraController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Input Suara
router.post('/', authenticate, authorize(['penghitungan']), suaraController.inputSuara);

// Grafik Total Suara
router.get('/grafik', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kelurahan']), suaraController.grafikSuara);

module.exports = router;
