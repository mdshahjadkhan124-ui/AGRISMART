const { Router } = require('express');
const controller = require('../controllers/farm.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { createFarmSchema, updateFarmSchema } = require('../validators/farm.validator');
const { addCropHistorySchema } = require('../validators/cropHistory.validator');
const { addSoilReportSchema } = require('../validators/soilReport.validator');
const { addActivitySchema, updateActivitySchema } = require('../validators/farmActivity.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

/**
 * @openapi
 * /farms:
 *   get:
 *     tags: [Farms]
 *     summary: List the current farmer's farms
 *     responses:
 *       200: { description: List of farms }
 *   post:
 *     tags: [Farms]
 *     summary: Create a farm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, areaAcres]
 *             properties:
 *               name: { type: string }
 *               areaAcres: { type: number }
 *               soilType: { type: string, enum: [alluvial, black, red, laterite, arid, saline, peaty, forest, other] }
 *               irrigationType: { type: string, enum: [canal, borewell, drip, sprinkler, rainfed, other] }
 *               location: { type: object, properties: { lat: { type: number }, lng: { type: number }, address: { type: string } } }
 *     responses:
 *       201: { description: Farm created }
 */
router.get('/', controller.listFarms);
router.post('/', validate(createFarmSchema), controller.createFarm);

/**
 * @openapi
 * /farms/{farmId}:
 *   get:
 *     tags: [Farms]
 *     summary: Get a farm (must be owned by the caller)
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Farm }
 *       403: { description: Not your farm }
 *       404: { description: Farm not found }
 *   put:
 *     tags: [Farms]
 *     summary: Update a farm (must be owned by the caller)
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Farm updated }
 *       403: { description: Not your farm }
 *   delete:
 *     tags: [Farms]
 *     summary: Delete a farm and all its crop history, soil reports, and activities
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Farm deleted }
 *       403: { description: Not your farm }
 */
router.get('/:farmId', controller.getFarm);
router.put('/:farmId', validate(updateFarmSchema), controller.updateFarm);
router.delete('/:farmId', controller.deleteFarm);

/**
 * @openapi
 * /farms/{farmId}/crop-history:
 *   get:
 *     tags: [Farms]
 *     summary: List a farm's crop history
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Crop history entries }
 *   post:
 *     tags: [Farms]
 *     summary: Add a past crop to a farm's history
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cropName, season]
 *             properties:
 *               cropName: { type: string }
 *               season: { type: string, enum: [kharif, rabi, zaid, perennial] }
 *               sowingDate: { type: string, format: date }
 *               harvestDate: { type: string, format: date }
 *               yieldQuantityKg: { type: number }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Entry added }
 */
router.get('/:farmId/crop-history', controller.listCropHistory);
router.post('/:farmId/crop-history', validate(addCropHistorySchema), controller.addCropHistory);

/**
 * @openapi
 * /farms/{farmId}/soil-reports:
 *   get:
 *     tags: [Farms]
 *     summary: List a farm's soil reports (paginated)
 *     parameters:
 *       - { name: farmId, in: path, required: true, schema: { type: string } }
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Soil reports }
 *   post:
 *     tags: [Farms]
 *     summary: Log a soil test — computes a rule-based 0-100 health score and recommendations
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nitrogen, phosphorus, potassium, ph]
 *             properties:
 *               nitrogen: { type: number, description: kg/ha }
 *               phosphorus: { type: number, description: kg/ha }
 *               potassium: { type: number, description: kg/ha }
 *               ph: { type: number, minimum: 0, maximum: 14 }
 *               organicCarbon: { type: number }
 *               moisturePercent: { type: number }
 *     responses:
 *       201: { description: Soil report saved with computed healthScore/healthLabel/recommendations }
 */
router.get('/:farmId/soil-reports', controller.listSoilReports);

/**
 * @openapi
 * /farms/{farmId}/soil-reports/latest:
 *   get:
 *     tags: [Farms]
 *     summary: Get a farm's most recent soil report
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Latest soil report }
 *       404: { description: No soil reports yet }
 */
router.get('/:farmId/soil-reports/latest', controller.getLatestSoilReport);
router.post('/:farmId/soil-reports', validate(addSoilReportSchema), controller.addSoilReport);

/**
 * @openapi
 * /farms/{farmId}/activities:
 *   get:
 *     tags: [Farms]
 *     summary: List a farm's activity diary (paginated)
 *     parameters:
 *       - { name: farmId, in: path, required: true, schema: { type: string } }
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Activities }
 *   post:
 *     tags: [Farms]
 *     summary: Log a farm activity
 *     parameters: [{ name: farmId, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [activityType, title]
 *             properties:
 *               activityType: { type: string, enum: [sowing, irrigation, fertilizing, pesticide_spray, weeding, harvesting, soil_testing, other] }
 *               title: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date }
 *               costInr: { type: number }
 *     responses:
 *       201: { description: Activity logged }
 */
router.get('/:farmId/activities', controller.listActivities);
router.post('/:farmId/activities', validate(addActivitySchema), controller.addActivity);

/**
 * @openapi
 * /farms/{farmId}/activities/{activityId}:
 *   put:
 *     tags: [Farms]
 *     summary: Update a farm activity
 *     parameters:
 *       - { name: farmId, in: path, required: true, schema: { type: string } }
 *       - { name: activityId, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Activity updated }
 *   delete:
 *     tags: [Farms]
 *     summary: Delete a farm activity
 *     parameters:
 *       - { name: farmId, in: path, required: true, schema: { type: string } }
 *       - { name: activityId, in: path, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Activity deleted }
 */
router.put('/:farmId/activities/:activityId', validate(updateActivitySchema), controller.updateActivity);
router.delete('/:farmId/activities/:activityId', controller.deleteActivity);

module.exports = router;
