const express = require('express');
const router = express.Router();
const userController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, userController.createUser);
router.get('/', authenticateToken, userController.getAllUsers);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);


module.exports = router;