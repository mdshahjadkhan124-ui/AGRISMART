const { Router } = require('express');
const controller = require('../controllers/notification.controller');
const authenticate = require('../middleware/authenticate');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List the current user's notifications (paginated, newest first)
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Notifications, with meta.unreadCount
 */
router.get('/', controller.listMyNotifications);

/**
 * @openapi
 * /notifications/read-all:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark all of the current user's notifications as read
 *     responses:
 *       200: { description: Marked as read }
 */
router.put('/read-all', controller.markAllAsRead);

/**
 * @openapi
 * /notifications/{id}/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark one notification as read
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Notification marked as read }
 *       404: { description: Not found (or not yours) }
 */
router.put('/:id/read', controller.markAsRead);

module.exports = router;
