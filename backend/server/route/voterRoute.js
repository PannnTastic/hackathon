const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const upload = require('../helper/fileUploader');
const { authenticateToken } = require('../middleware/authMiddleware');

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