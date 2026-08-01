const { Router } = require('express');
const controller = require('../controllers/governmentScheme.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { createSchemeSchema, updateSchemeSchema } = require('../validators/governmentScheme.validator');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /schemes:
 *   get:
 *     tags: [Government Schemes]
 *     summary: Browse schemes (active only, unless a gov admin/super admin passes includeInactive=true)
 *     parameters:
 *       - { name: category, in: query, schema: { type: string, enum: [subsidy, loan, insurance, training, equipment, other] } }
 *       - { name: state, in: query, schema: { type: string } }
 *       - { name: search, in: query, schema: { type: string } }
 *       - { name: includeInactive, in: query, schema: { type: string, enum: ['true'] } }
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Schemes }
 *   post:
 *     tags: [Government Schemes]
 *     summary: Publish a scheme (gov admin / super admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string, enum: [subsidy, loan, insurance, training, equipment, other] }
 *               eligibility: { type: string }
 *               state: { type: string }
 *               applicationLink: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       201: { description: Scheme published }
 */
router.get('/', controller.listSchemes);
router.post('/', authorize(ROLES.GOV_ADMIN, ROLES.SUPER_ADMIN), validate(createSchemeSchema), controller.createScheme);

/**
 * @openapi
 * /schemes/{id}:
 *   get:
 *     tags: [Government Schemes]
 *     summary: Get one scheme
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Scheme }
 *   put:
 *     tags: [Government Schemes]
 *     summary: Update a scheme (any gov admin / super admin — schemes are a shared resource, not personal data)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Scheme updated }
 *   delete:
 *     tags: [Government Schemes]
 *     summary: Delete a scheme (gov admin / super admin only)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Scheme deleted }
 */
router.get('/:id', controller.getScheme);
router.put('/:id', authorize(ROLES.GOV_ADMIN, ROLES.SUPER_ADMIN), validate(updateSchemeSchema), controller.updateScheme);
router.delete('/:id', authorize(ROLES.GOV_ADMIN, ROLES.SUPER_ADMIN), controller.deleteScheme);

module.exports = router;
