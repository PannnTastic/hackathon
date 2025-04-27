const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const petugasController = require('../controllers/petugasController');
const tpsController = require('../controllers/tpsController'); // Import tpsController
const laporanController = require('../controllers/laporanController'); // Import laporanController
const suara = require('../controllers/suaraController'); // Import suaraController
const { authenticate, isKecamatan } = require('../middleware/authMiddleware');

// Apply authentication and role-based middleware
router.use(authenticate, isKecamatan);

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

router.get('/laporan', laporanController.getLaporan);
router.put('/laporan/:id', laporanController.updateLaporan);

router.put('/suara/:id', suara.editSuara); // Edit suara
router.get('/suara', suara.getSuara); // Read suara

module.exports = router;
