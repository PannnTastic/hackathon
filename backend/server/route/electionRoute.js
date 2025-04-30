require('express').Router();
const electionController = require('../controllers/electionController');
const { authenticateToken } = require('../middleware/authMiddleware');
// Election Routes
