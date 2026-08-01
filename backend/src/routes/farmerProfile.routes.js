const { Router } = require('express');
const controller = require('../controllers/farmerProfile.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { upsertProfileSchema } = require('../validators/farmerProfile.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

router.get('/me', controller.getMyProfile);
router.put('/me', validate(upsertProfileSchema), controller.upsertMyProfile);

module.exports = router;
