const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkRolePermission } = require('../middleware/roleMiddleware');



// Apply authentication and role-based middleware
router.use(authenticateToken);

// Create, Read, Update, Delete (CRUD) For All Role With Constraint
router.post('/createUser', adminController.createAdmin); // Create admin
router.get('/readUser', adminController.getAdmin); // Read admin
router.put('/updateUser/:idUser', adminController.updateAdmin); // Update admin
router.delete('/deleteUser/:idUser', adminController.deleteAdmin); // Delete admin


module.exports = router;
