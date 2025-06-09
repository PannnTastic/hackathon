// File: server/routes/tpsRoute.js

const express = require('express');
const router = express.Router();
const tpsController = require('../controllers/tpsController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Middleware gabungan kita

// CREATE TPS
router.post('/', authenticateToken, tpsController.createTps);

// Semua peran yang login boleh mencoba, SP akan memfilter hasilnya
router.get('/', authenticateToken, tpsController.readAllTps);

// UPDATE TPS
router.put('/:id', authenticateToken, tpsController.updateTps);

// DELETE TPS
router.delete('/:id', authenticateToken, tpsController.deleteTps);

module.exports = router;