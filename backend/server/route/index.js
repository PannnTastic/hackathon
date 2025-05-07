const router = require('express').Router();
const authRoutes = require('./authRoutes');
const nasionalRoutes = require('./nasionalRoutes');


router.use('/nasional', nasionalRoutes);
router.use('/auth', authRoutes);

module.exports = router;