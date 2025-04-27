const express = require('express');
const router = express.Router();
const uploadRoutes = require('./uploadRoutes');
const adminRoutes = require('./adminRoutes');
const laporanRoutes = require('./laporanRoutes');
const suaraRoutes = require('./suaraRoutes');

// Use Routes
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/laporan', laporanRoutes);
router.use('/suara', suaraRoutes);

module.exports = router; 