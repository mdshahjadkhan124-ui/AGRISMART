const { Router } = require('express');
const controller = require('../controllers/expertProfile.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { upsertExpertProfileSchema } = require('../validators/expertProfile.validator');

const router = Router();

router.use(authenticate);

router.get('/', controller.listExperts);
router.get('/me', authorize(ROLES.EXPERT), controller.getMyProfile);
router.put('/me', authorize(ROLES.EXPERT), validate(upsertExpertProfileSchema), controller.upsertMyProfile);
router.get('/:id', controller.getExpertById);

module.exports = router;
