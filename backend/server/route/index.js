const router = require('express').Router();
const authRoutes = require('./authRoute');
const adminRoute = require('./adminRoute');
const tpsRoute = require('./tpsRoute');

router.use('/admin', adminRoute);
router.use('/auth', authRoutes);
router.use('/tps', tpsRoute);


module.exports = router;