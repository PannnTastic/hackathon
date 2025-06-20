const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const {authenticateToken} = require('../middleware/authMiddleware');
const upload = require('../helper/fileUploader');

router.post('/', authenticateToken, upload.single('locationPhoto'), electionController.createElectionData);
router.get('/', authenticateToken, electionController.getElectionData);
router.put('/:id', authenticateToken, upload.single('locationPhoto'), electionController.updateElectionData);
router.delete('/:id', authenticateToken, electionController.archiveElectionData);

module.exports = router;