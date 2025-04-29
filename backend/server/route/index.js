const router = require('express').Router();
const authRoutes = require('./authRoutes');
const nasionalRoutes = require('./nasionalRoutes');

router.use('/admin', nasionalRoutes);
router.use('/auth', authRoutes);

module.exports = router;