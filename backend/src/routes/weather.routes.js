const { Router } = require('express');
const controller = require('../controllers/weather.controller');
const { validateQuery } = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { weatherQuerySchema } = require('../validators/weather.validator');

const router = Router();

router.use(authenticate);

router.get('/current', validateQuery(weatherQuerySchema), controller.getCurrent);
router.get('/forecast', validateQuery(weatherQuerySchema), controller.getForecast);

module.exports = router;
