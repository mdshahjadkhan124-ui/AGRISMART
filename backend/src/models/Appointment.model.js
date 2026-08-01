const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requestedDate: { type: Date, required: [true, 'Requested date/time is required'] },
    meetingType: { type: String, enum: ['chat', 'audio', 'video'], default: 'chat' },
    reason: { type: String, required: [true, 'Please describe what you need help with'], trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    expertNotes: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
