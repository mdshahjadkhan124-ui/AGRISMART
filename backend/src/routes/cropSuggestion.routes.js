const { Router } = require('express');
const controller = require('../controllers/cropSuggestion.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { cropSuggestionSchema } = require('../validators/cropSuggestion.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

/**
 * @openapi
 * /crop-suggestions:
 *   post:
 *     tags: [Crop Suggestion]
 *     summary: Rank crops against a static suitability table by soil/climate inputs (no ML)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [n, p, k, temperature, humidity, ph, rainfall]
 *             properties:
 *               n: { type: number, description: 'Nitrogen, kg/ha' }
 *               p: { type: number, description: 'Phosphorus, kg/ha' }
 *               k: { type: number, description: 'Potassium, kg/ha' }
 *               temperature: { type: number, description: °C }
 *               humidity: { type: number, description: '%' }
 *               ph: { type: number }
 *               rainfall: { type: number, description: mm }
 *               farmId: { type: string, description: Optional, only used to tag the saved suggestion }
 *     responses:
 *       201: { description: Top 5 ranked crop matches, saved to history }
 *   get:
 *     tags: [Crop Suggestion]
 *     summary: List the current farmer's past crop suggestions
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Suggestion history }
 */
router.post('/', validate(cropSuggestionSchema), controller.create);
router.get('/', controller.listHistory);

module.exports = router;
