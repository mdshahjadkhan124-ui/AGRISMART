const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    address: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    village: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    farmingExperienceYears: { type: Number, min: 0, default: 0 },
    preferredLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
    bio: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
