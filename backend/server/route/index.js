const router = require('express').Router();
const authRoutes = require('./authRoutes');
const adminRoute = require('./adminRoute');

router.use('/admin', adminRoute);
router.use('/auth', authRoutes);

module.exports = router;