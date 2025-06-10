const express = require('express');
const router = express.Router();
const tpsController = require('../controllers/tpsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, tpsController.createTps);
router.get('/', authenticateToken, tpsController.readAllTps);
router.put('/:id', authenticateToken, tpsController.updateTps);
router.delete('/:id', authenticateToken, tpsController.deleteTps);

module.exports = router;