const { Router } = require('express');
const controller = require('../controllers/notification.controller');
const authenticate = require('../middleware/authenticate');

const router = Router();

router.use(authenticate);

router.get('/', controller.listMyNotifications);
router.put('/read-all', controller.markAllAsRead);
router.put('/:id/read', controller.markAsRead);

module.exports = router;
