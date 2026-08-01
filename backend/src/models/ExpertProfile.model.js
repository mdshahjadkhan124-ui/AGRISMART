const mongoose = require('mongoose');

const expertProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: { type: String, trim: true, maxlength: 100, default: '' },
    qualifications: { type: String, trim: true, maxlength: 300, default: '' },
    experienceYears: { type: Number, min: 0, default: 0 },
    bio: { type: String, trim: true, maxlength: 500, default: '' },
    consultationFeeInr: { type: Number, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExpertProfile', expertProfileSchema);
