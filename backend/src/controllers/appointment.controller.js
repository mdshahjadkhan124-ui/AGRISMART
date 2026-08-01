const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const appointmentService = require('../services/appointment.service');
const chatService = require('../services/chat.service');

const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.bookAppointment(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { appointment }, 'Appointment requested'));
});

const listMyAppointments = asyncHandler(async (req, res) => {
  const { items, meta } = await appointmentService.listMyAppointments(req.user.id, req.user.role, req.query);
  res.status(200).json(new ApiResponse(200, { appointments: items }, 'Success', meta));
});

const getAppointment = asyncHandler(async (req, res) => {
  const { appointment } = await appointmentService.getOwnedAppointment(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, { appointment }));
});

const updateStatus = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateStatus(req.params.id, req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { appointment }, 'Appointment updated'));
});

const listMessages = asyncHandler(async (req, res) => {
  const messages = await chatService.listMessages(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, { messages }));
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await chatService.sendMessage(req.params.id, req.user.id, req.body.text);
  res.status(201).json(new ApiResponse(201, { message }));
});

const getCallInfo = asyncHandler(async (req, res) => {
  const call = await chatService.getCallInfo(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, { call }));
});

module.exports = { bookAppointment, listMyAppointments, getAppointment, updateStatus, listMessages, sendMessage, getCallInfo };
