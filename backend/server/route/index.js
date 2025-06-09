const router = require('express').Router();
const authRoutes = require('./authRoute');
const adminRoute = require('./adminRoute');
const tpsRoute = require('./tpsRoute');
const voterRoute = require('./voterRoute');

router.use('/admin', adminRoute);
router.use('/auth', authRoutes);
router.use('/tps', tpsRoute);
router.use('/voter', voterRoute);


module.exports = router;