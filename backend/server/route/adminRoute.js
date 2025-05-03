const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.post('/', adminController.createAdmin);
router.get('/', adminController.readAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
