const router = require('express').Router();
const laporanRoutes = require('./laporanRoutes');
const suaraRoutes = require('./suaraRoutes');
const authRoutes = require('./authRoutes'); // Import auth routes
const petugasRoutes = require('./petugasRoutes'); // Import petugas routes
const nasionalRoutes = require('./nasionalRoutes');
const provinsiRoutes = require('./provinsiRoutes');
const kabupatenRoutes = require('./kabupatenRoutes');
const kecamatanRoutes = require('./kecamatanRoutes');

// Use Routes
router.use('/nasional', nasionalRoutes);
router.use('/provinsi', provinsiRoutes);
router.use('/kabupaten', kabupatenRoutes);
router.use('/kecamatan', kecamatanRoutes);
router.use('/laporan', laporanRoutes);
router.use('/suara', suaraRoutes);
router.use('/auth', authRoutes); // Add auth routes
router.use('/petugas', petugasRoutes); // Add petugas routes

module.exports = router;