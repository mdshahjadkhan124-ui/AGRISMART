const { Router } = require('express');
const controller = require('../controllers/governmentScheme.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { createSchemeSchema, updateSchemeSchema } = require('../validators/governmentScheme.validator');

const router = Router();

router.use(authenticate);

router.get('/', controller.listSchemes);
router.post('/', authorize(ROLES.GOV_ADMIN, ROLES.SUPER_ADMIN), validate(createSchemeSchema), controller.createScheme);
router.get('/:id', controller.getScheme);
router.put('/:id', authorize(ROLES.GOV_ADMIN, ROLES.SUPER_ADMIN), validate(updateSchemeSchema), controller.updateScheme);
router.delete('/:id', authorize(ROLES.GOV_ADMIN, ROLES.SUPER_ADMIN), controller.deleteScheme);

module.exports = router;
