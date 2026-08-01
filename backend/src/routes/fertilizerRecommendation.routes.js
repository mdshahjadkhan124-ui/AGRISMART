const { Router } = require('express');
const controller = require('../controllers/fertilizerRecommendation.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { fertilizerRecommendationSchema } = require('../validators/fertilizerRecommendation.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

router.post('/', validate(fertilizerRecommendationSchema), controller.create);
router.get('/', controller.listHistory);

module.exports = router;
