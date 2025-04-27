const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create Admin
router.post('/', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kelurahan']), adminController.createAdmin);

// Get All Admins
router.get('/', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kelurahan']), adminController.getAdmins);

// Update Admin
router.put('/:id', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kelurahan']), adminController.updateAdmin);
 
// Delete Admin
router.delete('/:id', authenticate, authorize(['nasional', 'provinsi', 'kabupaten', 'kelurahan']), adminController.deleteAdmin);

module.exports = router;
