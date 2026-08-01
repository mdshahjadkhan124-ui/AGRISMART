const { Router } = require('express');
const controller = require('../controllers/expertProfile.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { upsertExpertProfileSchema } = require('../validators/expertProfile.validator');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /experts:
 *   get:
 *     tags: [Experts]
 *     summary: Browse the public expert directory (only experts with a completed profile appear)
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *       - { name: availableOnly, in: query, schema: { type: string, enum: ['true'] } }
 *     responses:
 *       200: { description: Expert profiles }
 */
router.get('/', controller.listExperts);

/**
 * @openapi
 * /experts/me:
 *   get:
 *     tags: [Experts]
 *     summary: Get the current expert's own profile
 *     responses:
 *       200: { description: Profile (null if not yet created) }
 *       403: { description: Not an expert }
 *   put:
 *     tags: [Experts]
 *     summary: Create or update the current expert's profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization: { type: string }
 *               qualifications: { type: string }
 *               experienceYears: { type: number }
 *               bio: { type: string }
 *               consultationFeeInr: { type: number }
 *               isAvailable: { type: boolean }
 *     responses:
 *       200: { description: Profile saved }
 */
router.get('/me', authorize(ROLES.EXPERT), controller.getMyProfile);
router.put('/me', authorize(ROLES.EXPERT), validate(upsertExpertProfileSchema), controller.upsertMyProfile);

/**
 * @openapi
 * /experts/{id}:
 *   get:
 *     tags: [Experts]
 *     summary: Get one expert's public profile by its ExpertProfile id
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Expert profile }
 *       404: { description: Not found or the account is deactivated }
 */
router.get('/:id', controller.getExpertById);

module.exports = router;
