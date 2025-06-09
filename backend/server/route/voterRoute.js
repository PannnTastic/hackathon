const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Middleware gabungan kita

// CREATE: Hanya bisa dilakukan oleh Petugas TPS
router.post('/', authenticateToken, voterController.createVoter);

// READ (List): Semua peran yang login boleh mencoba, SP akan memfilter
router.get('/', authenticateToken, voterController.readAllVoters);

// UPDATE: Semua peran yang login boleh mencoba, SP akan memvalidasi kewenangan
router.put('/:id', authenticateToken, voterController.updateVoter);

// DELETE (Archive): Semua peran yang login boleh mencoba
router.delete('/:id', authenticateToken, voterController.deleteVoter);

module.exports = router;