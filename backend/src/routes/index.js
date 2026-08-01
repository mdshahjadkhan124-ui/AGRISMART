const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Future phases mount their routers here, e.g.:
// router.use('/farmers', farmerRoutes);

module.exports = router;
