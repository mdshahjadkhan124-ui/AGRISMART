const { Router } = require('express');
const controller = require('../controllers/appointment.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { bookAppointmentSchema, updateStatusSchema } = require('../validators/appointment.validator');
const { sendMessageSchema } = require('../validators/chat.validator');

const router = Router();

router.use(authenticate);

router.post('/', authorize(ROLES.FARMER), validate(bookAppointmentSchema), controller.bookAppointment);
router.get('/', authorize(ROLES.FARMER, ROLES.EXPERT), controller.listMyAppointments);
router.get('/:id', authorize(ROLES.FARMER, ROLES.EXPERT), controller.getAppointment);
router.put('/:id/status', authorize(ROLES.FARMER, ROLES.EXPERT), validate(updateStatusSchema), controller.updateStatus);

router.get('/:id/messages', authorize(ROLES.FARMER, ROLES.EXPERT), controller.listMessages);
router.post('/:id/messages', authorize(ROLES.FARMER, ROLES.EXPERT), validate(sendMessageSchema), controller.sendMessage);

router.get('/:id/call', authorize(ROLES.FARMER, ROLES.EXPERT), controller.getCallInfo);

module.exports = router;
