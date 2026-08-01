const ChatMessage = require('../models/ChatMessage.model');
const { getOwnedAppointment } = require('./appointment.service');

async function listMessages(appointmentId, userId) {
  await getOwnedAppointment(appointmentId, userId);
  return ChatMessage.find({ appointment: appointmentId }).sort({ createdAt: 1 });
}

async function sendMessage(appointmentId, userId, text) {
  await getOwnedAppointment(appointmentId, userId);
  return ChatMessage.create({ appointment: appointmentId, sender: userId, text });
}

// Placeholder integration point for a real video/audio provider (e.g.
// Twilio Video, Daily.co, Agora) — wired up with real keys in a later
// phase. For now it just confirms access and hands back a room id the
// frontend can display.
async function getCallInfo(appointmentId, userId) {
  const { appointment } = await getOwnedAppointment(appointmentId, userId);
  return {
    roomId: `agrismart-appointment-${appointment._id}`,
    meetingType: appointment.meetingType,
    status: appointment.status,
    note: 'Video/audio calling is not yet wired to a provider — this is a scaffold for a future integration.',
  };
}

module.exports = { listMessages, sendMessage, getCallInfo };
