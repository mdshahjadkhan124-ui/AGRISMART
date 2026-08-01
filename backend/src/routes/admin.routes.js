const { Router } = require('express');
const controller = require('../controllers/admin.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { updateRoleSchema, updateStatusSchema } = require('../validators/adminUser.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.SUPER_ADMIN));

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (super admin only)
 *     parameters:
 *       - { name: role, in: query, schema: { type: string } }
 *       - { name: search, in: query, schema: { type: string }, description: Matches name or email }
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Users }
 *       403: { description: Not a super admin }
 */
router.get('/users', controller.listUsers);

/**
 * @openapi
 * /admin/users/{id}/role:
 *   put:
 *     tags: [Admin]
 *     summary: Change a user's role (audit-logged; you cannot change your own role)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties: { role: { type: string, enum: [farmer, expert, officer, seller, gov_admin, super_admin] } }
 *     responses:
 *       200: { description: Role updated; the user is notified }
 *       400: { description: Attempted to change your own role }
 */
router.put('/users/:id/role', validate(updateRoleSchema), controller.updateUserRole);

/**
 * @openapi
 * /admin/users/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Activate or deactivate a user (audit-logged; you cannot deactivate yourself)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties: { isActive: { type: boolean } }
 *     responses:
 *       200: { description: Status updated }
 *       400: { description: Attempted to deactivate your own account }
 */
router.put('/users/:id/status', validate(updateStatusSchema), controller.updateUserStatus);

/**
 * @openapi
 * /admin/audit-logs:
 *   get:
 *     tags: [Admin]
 *     summary: List audit log entries (super admin only), newest first
 *     parameters:
 *       - { name: action, in: query, schema: { type: string } }
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Audit log entries }
 */
router.get('/audit-logs', controller.listAuditLogs);

module.exports = router;
