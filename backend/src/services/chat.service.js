const ChatMessage = require('../models/ChatMessage.model');
const { getOwnedAppointment } = require('./appointment.service');
const notificationService = require('./notification.service');

async function listMessages(appointmentId, userId) {
  await getOwnedAppointment(appointmentId, userId);
  return ChatMessage.find({ appointment: appointmentId }).sort({ createdAt: 1 });
}

async function sendMessage(appointmentId, userId, text) {
  const { appointment } = await getOwnedAppointment(appointmentId, userId);
  const message = await ChatMessage.create({ appointment: appointmentId, sender: userId, text });

  const recipientId =
    appointment.farmer._id.toString() === userId ? appointment.expert._id.toString() : appointment.farmer._id.toString();

  try {
    const { getIO } = require('../sockets');
    getIO().to(`appointment:${appointmentId}`).emit('chat:message', {
      _id: message._id,
      appointment: appointmentId,
      sender: userId,
      text: message.text,
      createdAt: message.createdAt,
    });
  } catch {
    // Socket.IO not initialized — the message is already saved and will
    // show up on the recipient's next poll/fetch.
  }

  await notificationService.notify({
    userId: recipientId,
    type: 'chat',
    title: 'New message',
    message: text.length > 80 ? `${text.slice(0, 80)}…` : text,
    link: `/appointments/${appointmentId}`,
  });

  return message;
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
