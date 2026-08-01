const { Router } = require('express');
const controller = require('../controllers/farmerProfile.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { upsertProfileSchema } = require('../validators/farmerProfile.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

/**
 * @openapi
 * /farmers/me:
 *   get:
 *     tags: [Farmer Profile]
 *     summary: Get the current farmer's profile
 *     responses:
 *       200: { description: Profile (null if not yet created) }
 *       403: { description: Not a farmer }
 *   put:
 *     tags: [Farmer Profile]
 *     summary: Create or update the current farmer's profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address: { type: string }
 *               state: { type: string }
 *               district: { type: string }
 *               village: { type: string }
 *               pincode: { type: string }
 *               farmingExperienceYears: { type: number }
 *               preferredLanguage: { type: string, enum: [en, hi] }
 *               bio: { type: string }
 *     responses:
 *       200: { description: Profile saved }
 */
router.get('/me', controller.getMyProfile);
router.put('/me', validate(upsertProfileSchema), controller.upsertMyProfile);

module.exports = router;
