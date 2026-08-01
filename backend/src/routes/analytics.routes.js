const { Router } = require('express');
const controller = require('../controllers/analytics.controller');
const authenticate = require('../middleware/authenticate');

const router = Router();

router.get('/me', authenticate, controller.getMyAnalytics);

module.exports = router;
