const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const petugasController = require('../controllers/petugasController');
const tpsController = require('../controllers/tpsController'); // Import tpsController
const laporanController = require('../controllers/laporanController'); // Import laporanController
const suara = require('../controllers/suaraController'); // Import suaraController
const { authenticate, isProvinsi } = require('../middleware/authMiddleware');

// Apply authentication and role-based middleware
router.use(authenticate, isProvinsi);

// CRUD for kabupaten admins
router.post('/kabupaten', adminController.createAdmin);
router.get('/kabupaten', adminController.getAdmins);
router.put('/kabupaten/:id', adminController.updateAdmin);
router.delete('/kabupaten/:id', adminController.deleteAdmin);

// CRUD for kecamatan admins
router.post('/kecamatan', adminController.createAdmin);
router.get('/kecamatan', adminController.getAdmins);
router.put('/kecamatan/:id', adminController.updateAdmin);
router.delete('/kecamatan/:id', adminController.deleteAdmin);

// CRUD for kelurahan admins
router.post('/kelurahan', adminController.createAdmin);
router.get('/kelurahan', adminController.getAdmins);
router.put('/kelurahan/:id', adminController.updateAdmin);
router.delete('/kelurahan/:id', adminController.deleteAdmin);

// CRUD for petugas
router.post('/petugas', petugasController.createPetugas);
router.get('/petugas', petugasController.getPetugas);
router.put('/petugas/:id', petugasController.updatePetugas);
router.delete('/petugas/:id', petugasController.deletePetugas);

// CRUD for TPS
router.post('/tps', tpsController.createTps);
router.get('/tps', tpsController.getTps);
router.put('/tps/:id', tpsController.updateTps);
router.delete('/tps/:id', tpsController.deleteTps);

// CRUD for laporan
router.get('/laporan', laporanController.getLaporan); // Read laporan
router.put('/laporan/:id', laporanController.updateLaporan); // Edit laporan

router.put('suara/:id', suara.editSuara); // Edit suara
router.get('/suara', suara.getSuara); // Read suara

module.exports = router;
