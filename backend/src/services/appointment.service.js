const Appointment = require('../models/Appointment.model');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

// Who is allowed to move an appointment from which status to which, based
// on whether the caller is the farmer or the expert on it. Anything not
// listed here is a terminal state — no further transitions.
const ALLOWED_TRANSITIONS = {
  pending: { expert: ['confirmed', 'rejected'], farmer: ['cancelled'] },
  confirmed: { expert: ['completed', 'cancelled'], farmer: ['cancelled'] },
};

async function bookAppointment(farmerId, { expertId, ...rest }) {
  return Appointment.create({ ...rest, farmer: farmerId, expert: expertId });
}

async function listMyAppointments(userId, role, query) {
  const { page, limit, skip } = getPagination(query);
  const filter = role === 'expert' ? { expert: userId } : { farmer: userId };

  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .populate('farmer', 'name email')
      .populate('expert', 'name email')
      .sort({ requestedDate: -1 })
      .skip(skip)
      .limit(limit),
    Appointment.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ page, limit }, total) };
}

// Shared ownership check: either participant (farmer or expert) can read
// an appointment; nobody else can.
async function getOwnedAppointment(appointmentId, userId) {
  const appointment = await Appointment.findById(appointmentId)
    .populate('farmer', 'name email')
    .populate('expert', 'name email');
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  const isFarmer = appointment.farmer._id.toString() === userId;
  const isExpert = appointment.expert._id.toString() === userId;
  if (!isFarmer && !isExpert) throw new ApiError(403, 'You do not have access to this appointment');

  return { appointment, actorRole: isExpert ? 'expert' : 'farmer' };
}

async function updateStatus(appointmentId, userId, { status, expertNotes }) {
  const { appointment, actorRole } = await getOwnedAppointment(appointmentId, userId);

  const allowed = ALLOWED_TRANSITIONS[appointment.status]?.[actorRole] || [];
  if (!allowed.includes(status)) {
    throw new ApiError(403, `You cannot change this appointment from "${appointment.status}" to "${status}"`);
  }

  appointment.status = status;
  if (expertNotes != null && actorRole === 'expert') appointment.expertNotes = expertNotes;
  await appointment.save();
  return appointment;
}

module.exports = { bookAppointment, listMyAppointments, getOwnedAppointment, updateStatus };
