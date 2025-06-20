const router = require('express').Router();
const authRoutes = require('./authRoute');
const adminRoute = require('./adminRoute');
const tpsRoute = require('./tpsRoute');
const voterRoute = require('./voterRoute');
const attendanceRoute = require('./attendanceRoute');
const electionRoute = require('./electionRoute');
const reportRoute = require('./reportRoute');
const publicRoute = require('./publicRoute');
const dashboardRoute = require('./dashboardRoute');

router.use('/admin', adminRoute);
router.use('/auth', authRoutes);
router.use('/tps', tpsRoute);
router.use('/voter', voterRoute);
router.use('/attendance', attendanceRoute);
router.use('/election', electionRoute);
router.use('/report', reportRoute);
router.use('/public', publicRoute);
router.use('/dashboard', dashboardRoute);


module.exports = router;