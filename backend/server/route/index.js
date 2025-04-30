const router = require('express').Router();
const authRoutes = require('./authRoute');
const electionRoutes = require('./electionRoute');
const adminRoute = require('./adminRoute');

router.use('/admin', adminRoute);
router.use('/auth', authRoutes);

module.exports = router;