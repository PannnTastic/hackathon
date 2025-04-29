const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const pemilihController = require('../controllers/pemilihController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkRolePermission } = require('../middleware/roleMiddleware');



// Apply authentication and role-based middleware
router.use(authenticate, isNasional);

// Create, Read, Update, Delete (CRUD) For All Role With Constraint
router.post('/createUser', adminController.createAdmin); // Create admin
router.get('/readUser', adminController.getAdmin); // Read admin
router.put('/updateUser/:idUser', adminController.updateAdmin); // Update admin
router.delete('/deleteUser/:idUser', adminController.deleteAdmin); // Delete admin

// Read voter
router.get('/readVoter', pemilihController.getPemilih); // Read voter
router.post('/createVoter', pemilihController.createPemilih); // Create voter
router.put('/updateVoter/:idPemilih', pemilihController.updatePemilih); // Update voter
router.delete('/deleteVoter/:idPemilih', pemilihController.deletePemilih); // Delete voter

module.exports = router;
