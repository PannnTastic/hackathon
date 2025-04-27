const express = require('express');
const router = express.Router();
const uploadRoutes = require('./uploadRoutes');
const adminRoutes = require('./adminRoutes');
const laporanRoutes = require('./laporanRoutes');
const suaraRoutes = require('./suaraRoutes');
const authRoutes = require('./authRoutes'); // Import auth routes
const petugasRoutes = require('./petugasRoutes'); // Import petugas routes

// Use Routes
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/laporan', laporanRoutes);
router.use('/suara', suaraRoutes);
router.use('/auth', authRoutes); // Add auth routes
router.use('/petugas', petugasRoutes); // Add petugas routes

module.exports = router;