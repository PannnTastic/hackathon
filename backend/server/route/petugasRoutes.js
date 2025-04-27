const express = require('express');
const router = express.Router();
const petugasController = require('../controllers/petugasController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create Petugas (restricted to kelurahan admins)
router.post('/', authenticate, authorize(['kelurahan']), petugasController.createPetugas);

// Get All Petugas
router.get('/', authenticate, authorize(['kelurahan', 'kabupaten']), petugasController.getPetugas);

// Update Petugas
router.put('/:id', authenticate, authorize(['kelurahan']), petugasController.updatePetugas);

// Delete Petugas
router.delete('/:id', authenticate, authorize(['kelurahan']), petugasController.deletePetugas);

module.exports = router;
