const { Router } = require('express');
const controller = require('../controllers/fertilizerRecommendation.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { fertilizerRecommendationSchema } = require('../validators/fertilizerRecommendation.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

/**
 * @openapi
 * /fertilizer-recommendations:
 *   post:
 *     tags: [Fertilizer Recommendation]
 *     summary: Get a rule-based fertilizer + dosage recommendation
 *     description: Provide either a farmId (uses that farm's latest soil report) or explicit nitrogen/phosphorus/potassium/ph. Explicit values always take precedence over farmId-derived ones.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farmId: { type: string }
 *               nitrogen: { type: number }
 *               phosphorus: { type: number }
 *               potassium: { type: number }
 *               ph: { type: number }
 *     responses:
 *       201: { description: Recommendation generated and saved to history }
 *       400: { description: Neither farmId nor full nutrient values were provided }
 *       404: { description: farmId given but that farm has no soil reports yet }
 *   get:
 *     tags: [Fertilizer Recommendation]
 *     summary: List the current farmer's past fertilizer recommendations
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Recommendation history }
 */
router.post('/', validate(fertilizerRecommendationSchema), controller.create);
router.get('/', controller.listHistory);

module.exports = router;
