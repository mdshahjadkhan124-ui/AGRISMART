const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const farmerProfileRoutes = require('./farmerProfile.routes');
const farmRoutes = require('./farm.routes');
const weatherRoutes = require('./weather.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/farmers', farmerProfileRoutes);
router.use('/farms', farmRoutes);
router.use('/weather', weatherRoutes);

// Future phases mount their routers here, e.g.:
// router.use('/advisory', advisoryRoutes);

module.exports = router;
