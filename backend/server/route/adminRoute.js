const express = require('express');
const router = express.Router();
const db = require('../helper/connectionDB');
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeC, authorizeUD } = require('../middleware/roleMiddleware');

router.use(authenticateToken);
router.post('/createUser', authorizeC('adminController'),adminController.createAdmin);
router.get('/readUser', adminController.getAdmin);
router.put('/updateUser/:idUser/:regionCodeTarget', authorizeUD('adminController'), adminController.updateAdmin);
router.delete('/deleteUser/:idUser/:regionCodeTarget', authorizeUD('adminController'), adminController.deleteAdmin);

module.exports = router;
