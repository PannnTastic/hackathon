const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const voterController = require('../controllers/voterController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Middleware gabungan kita

// CREATE: Hanya bisa dilakukan oleh Petugas TPS
router.post('/', authenticateToken, voterController.createVoter);

router.post(
    '/upload-pdf',
    authenticateToken,
    upload.single('dpt_pdf'),
    voterController.uploadVotersFromPdf
);

router.get('/', authenticateToken, voterController.readAllVoters);

router.put('/:id', authenticateToken, voterController.updateVoter);

router.delete('/:id', authenticateToken, voterController.deleteVoter);

module.exports = router;