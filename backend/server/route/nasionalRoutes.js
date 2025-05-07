const express = require('express');
const { getLaporan, updateLaporan } = require('../controllers/laporanController');
const { createTps, getTps, updateTps, deleteTps } = require('../controllers/tpsController');
const { createSuara, getSuara, updateSuara, deleteSuara } = require('../controllers/suaraController');
const { createPemilih, getPemilih, updatePemilih, deletePemilih } = require('../controllers/pemilihController');
const { createAdmin, getAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const { authorizeC, authorizeUD } = require('../middleware/roleMiddleware');
const {authenticateToken} = require('../middleware/authMiddleware')

const router = express.Router();
router.use(authenticateToken); 

// Routes for Laporan
router.get('/laporan', getLaporan);
router.put('/laporan/:id',  updateLaporan);

// Routes for TPS
router.post('/tps', createTps);
router.get('/tps', getTps);
router.put('/tps/:id', updateTps);
router.delete('/tps/:id', deleteTps);

// Routes for Admin
router.post('/admin', authorizeC('adminController'), createAdmin);
router.get('/admin', getAdmin);
router.put('/admin/:idUser', updateAdmin);
router.delete('/admin/:idUser', deleteAdmin);

// Routes for Suara
router.post('/suara', createSuara);
router.get('/suara', getSuara);
router.put('/suara/:id', updateSuara);
router.delete('/suara/:id', deleteSuara);

// Routes for Pemilih
router.post('/pemilih', createPemilih);
router.get('/pemilih', getPemilih);
router.put('/pemilih/:id', updatePemilih);
router.delete('/pemilih/:id', deletePemilih);

module.exports = router;
