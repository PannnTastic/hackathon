const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.post('/', adminController.createAdmin);
router.get('/', adminController.getAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/deleteUser/:idUser/:regionCodeTarget', adminController.deleteAdmin);

module.exports = router;
