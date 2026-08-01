const { Router } = require('express');
const controller = require('../controllers/weather.controller');
const { validateQuery } = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { weatherQuerySchema } = require('../validators/weather.validator');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /weather/current:
 *   get:
 *     tags: [Weather]
 *     summary: Get current weather for a location
 *     parameters:
 *       - { name: lat, in: query, required: true, schema: { type: number } }
 *       - { name: lon, in: query, required: true, schema: { type: number } }
 *       - { name: farmId, in: query, schema: { type: string }, description: Optional, only used to tag the WeatherLog entry }
 *     responses:
 *       200: { description: Current weather }
 *       501: { description: Not configured (OPENWEATHER_API_KEY missing) }
 */
router.get('/current', validateQuery(weatherQuerySchema), controller.getCurrent);

/**
 * @openapi
 * /weather/forecast:
 *   get:
 *     tags: [Weather]
 *     summary: Get a 5-day forecast for a location (daily min/max/condition, aggregated from 3-hour steps)
 *     parameters:
 *       - { name: lat, in: query, required: true, schema: { type: number } }
 *       - { name: lon, in: query, required: true, schema: { type: number } }
 *       - { name: farmId, in: query, schema: { type: string } }
 *     responses:
 *       200: { description: Forecast }
 *       501: { description: Not configured (OPENWEATHER_API_KEY missing) }
 */
router.get('/forecast', validateQuery(weatherQuerySchema), controller.getForecast);

module.exports = router;
