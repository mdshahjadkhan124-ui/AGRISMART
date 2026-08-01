const { Router } = require('express');
const controller = require('../controllers/cropSuggestion.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { cropSuggestionSchema } = require('../validators/cropSuggestion.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

router.post('/', validate(cropSuggestionSchema), controller.create);
router.get('/', controller.listHistory);

module.exports = router;
