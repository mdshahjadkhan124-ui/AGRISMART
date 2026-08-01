const { Router } = require('express');
const controller = require('../controllers/diseaseReport.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/roles');
const { createReportSchema, respondSchema } = require('../validators/diseaseReport.validator');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /disease-reports:
 *   post:
 *     tags: [Disease Reports]
 *     summary: Submit a leaf photo + symptoms for expert review (farmer only, no image classifier)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [cropName, symptoms, image]
 *             properties:
 *               cropName: { type: string }
 *               symptoms: { type: string }
 *               farmId: { type: string }
 *               image: { type: string, format: binary, description: 'Max 5MB, image files only' }
 *     responses:
 *       201: { description: Report submitted with status "pending" }
 *       400: { description: Missing photo or invalid fields }
 *       501: { description: Image uploads not configured (CLOUDINARY_* missing) }
 *   get:
 *     tags: [Disease Reports]
 *     summary: List the current farmer's own disease reports (paginated)
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Reports }
 */
router.post(
  '/',
  authorize(ROLES.FARMER),
  upload.single('image'),
  validate(createReportSchema),
  controller.createReport
);
router.get('/', authorize(ROLES.FARMER), controller.listMyReports);

/**
 * @openapi
 * /disease-reports/queue:
 *   get:
 *     tags: [Disease Reports]
 *     summary: List reports awaiting expert review (expert / super admin only), oldest first
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Pending/in-review reports }
 *       403: { description: Not an expert or super admin }
 */
router.get('/queue', authorize(ROLES.EXPERT, ROLES.SUPER_ADMIN), controller.listQueue);

/**
 * @openapi
 * /disease-reports/{id}/respond:
 *   put:
 *     tags: [Disease Reports]
 *     summary: Submit a diagnosis and treatment, resolving the report (expert / super admin only)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [diagnosis, treatment]
 *             properties:
 *               diagnosis: { type: string }
 *               treatment: { type: string }
 *     responses:
 *       200: { description: Report resolved; farmer is notified }
 *       409: { description: Report already resolved }
 */
router.put('/:id/respond', authorize(ROLES.EXPERT, ROLES.SUPER_ADMIN), validate(respondSchema), controller.respondToReport);

/**
 * @openapi
 * /disease-reports/{id}:
 *   get:
 *     tags: [Disease Reports]
 *     summary: Get one of the current farmer's own disease reports
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Report }
 *       404: { description: Not found (or not yours) }
 */
router.get('/:id', authorize(ROLES.FARMER), controller.getMyReport);

module.exports = router;
