const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const farmerProfileRoutes = require('./farmerProfile.routes');
const farmRoutes = require('./farm.routes');
const weatherRoutes = require('./weather.routes');
const cropSuggestionRoutes = require('./cropSuggestion.routes');
const fertilizerRecommendationRoutes = require('./fertilizerRecommendation.routes');
const diseaseReportRoutes = require('./diseaseReport.routes');
const expertRoutes = require('./expert.routes');
const appointmentRoutes = require('./appointment.routes');
const marketplaceProductRoutes = require('./marketplaceProduct.routes');
const marketplaceOrderRoutes = require('./marketplaceOrder.routes');
const governmentSchemeRoutes = require('./governmentScheme.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/farmers', farmerProfileRoutes);
router.use('/farms', farmRoutes);
router.use('/weather', weatherRoutes);
router.use('/crop-suggestions', cropSuggestionRoutes);
router.use('/fertilizer-recommendations', fertilizerRecommendationRoutes);
router.use('/disease-reports', diseaseReportRoutes);
router.use('/experts', expertRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/marketplace/products', marketplaceProductRoutes);
router.use('/marketplace/orders', marketplaceOrderRoutes);
router.use('/schemes', governmentSchemeRoutes);

// Future phases mount their routers here, e.g.:
// router.use('/notifications', notificationRoutes);

module.exports = router;
