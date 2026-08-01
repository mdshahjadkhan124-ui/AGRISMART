const { Router } = require('express');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/health', healthRoutes);

// Future phases mount their routers here, e.g.:
// router.use('/auth', authRoutes);
// router.use('/farmers', farmerRoutes);

module.exports = router;
