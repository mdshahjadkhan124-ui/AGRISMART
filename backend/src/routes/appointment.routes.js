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

/**
 * @openapi
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Request a consultation with an expert (farmer only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [expertId, requestedDate, reason]
 *             properties:
 *               expertId: { type: string }
 *               requestedDate: { type: string, format: date-time }
 *               meetingType: { type: string, enum: [chat, audio, video] }
 *               reason: { type: string }
 *     responses:
 *       201: { description: Appointment requested with status "pending"; expert is notified }
 *   get:
 *     tags: [Appointments]
 *     summary: List the current user's appointments (as farmer or as expert)
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Appointments }
 */
router.post('/', authorize(ROLES.FARMER), validate(bookAppointmentSchema), controller.bookAppointment);
router.get('/', authorize(ROLES.FARMER, ROLES.EXPERT), controller.listMyAppointments);

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get an appointment (must be a participant)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Appointment }
 *       403: { description: Not a participant }
 */
router.get('/:id', authorize(ROLES.FARMER, ROLES.EXPERT), controller.getAppointment);

/**
 * @openapi
 * /appointments/{id}/status:
 *   put:
 *     tags: [Appointments]
 *     summary: Change an appointment's status
 *     description: >
 *       Allowed transitions depend on which side of the appointment the caller is:
 *       from "pending" the expert may confirm/reject and the farmer may cancel;
 *       from "confirmed" the expert may complete/cancel and the farmer may cancel.
 *       Any other transition is rejected.
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [confirmed, rejected, completed, cancelled] }
 *               expertNotes: { type: string }
 *     responses:
 *       200: { description: Updated; the other participant is notified }
 *       403: { description: That transition is not allowed from this role/status }
 */
router.put('/:id/status', authorize(ROLES.FARMER, ROLES.EXPERT), validate(updateStatusSchema), controller.updateStatus);

/**
 * @openapi
 * /appointments/{id}/messages:
 *   get:
 *     tags: [Appointments]
 *     summary: List chat messages for an appointment (must be a participant)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Messages, oldest first }
 *   post:
 *     tags: [Appointments]
 *     summary: Send a chat message (persisted, then pushed live over Socket.IO to the appointment room)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties: { text: { type: string } }
 *     responses:
 *       201: { description: Message sent; the other participant is notified }
 */
router.get('/:id/messages', authorize(ROLES.FARMER, ROLES.EXPERT), controller.listMessages);
router.post('/:id/messages', authorize(ROLES.FARMER, ROLES.EXPERT), validate(sendMessageSchema), controller.sendMessage);

/**
 * @openapi
 * /appointments/{id}/call:
 *   get:
 *     tags: [Appointments]
 *     summary: Get video/audio call info — a scaffold only, no real provider is wired up
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Room id and a note that no provider (Twilio Video / Daily.co / Agora) is configured yet }
 */
router.get('/:id/call', authorize(ROLES.FARMER, ROLES.EXPERT), controller.getCallInfo);

module.exports = router;
