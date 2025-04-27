const express = require('express');
const router = express.Router();
const petugasController = require('../controllers/petugasController');
const tpsController = require('../controllers/tpsController'); // Import tpsController
const laporanController = require('../controllers/laporanController'); // Import laporanController
const { authenticate, isKelurahan } = require('../middleware/authMiddleware');
const suara = require('../controllers/suaraController'); // Import suaraController

// Apply authentication and role-based middleware
router.use(authenticate, isKelurahan);

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
