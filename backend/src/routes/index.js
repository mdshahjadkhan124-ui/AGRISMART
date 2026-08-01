const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const farmerProfileRoutes = require('./farmerProfile.routes');
const farmRoutes = require('./farm.routes');
const weatherRoutes = require('./weather.routes');
const cropSuggestionRoutes = require('./cropSuggestion.routes');
const fertilizerRecommendationRoutes = require('./fertilizerRecommendation.routes');
const diseaseReportRoutes = require('./diseaseReport.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/farmers', farmerProfileRoutes);
router.use('/farms', farmRoutes);
router.use('/weather', weatherRoutes);
router.use('/crop-suggestions', cropSuggestionRoutes);
router.use('/fertilizer-recommendations', fertilizerRecommendationRoutes);
router.use('/disease-reports', diseaseReportRoutes);

// Future phases mount their routers here, e.g.:
// router.use('/appointments', appointmentRoutes);

module.exports = router;
