const { Router } = require('express');
const controller = require('../controllers/admin.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { updateRoleSchema, updateStatusSchema } = require('../validators/adminUser.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.SUPER_ADMIN));

router.get('/users', controller.listUsers);
router.put('/users/:id/role', validate(updateRoleSchema), controller.updateUserRole);
router.put('/users/:id/status', validate(updateStatusSchema), controller.updateUserStatus);
router.get('/audit-logs', controller.listAuditLogs);

module.exports = router;
