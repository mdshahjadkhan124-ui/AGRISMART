const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 2000 },
    category: {
      type: String,
      enum: ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other'],
      default: 'other',
    },
    eligibility: { type: String, trim: true, maxlength: 1000, default: '' },
    state: { type: String, trim: true, default: 'All India', maxlength: 100 },
    applicationLink: { type: String, trim: true, default: '' },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

governmentSchemeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
