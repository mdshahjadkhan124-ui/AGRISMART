const mongoose = require('mongoose');

// The manual-review replacement for automated disease classification: a
// farmer submits a photo + symptoms, it sits in a queue, and a human
// expert writes the diagnosis and treatment. No image classification model
// is involved anywhere in this flow.
const diseaseReportSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    cropName: { type: String, required: [true, 'Crop name is required'], trim: true, maxlength: 100 },
    symptoms: { type: String, required: [true, 'Symptom description is required'], trim: true, maxlength: 1000 },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'resolved'],
      default: 'pending',
      index: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    diagnosis: { type: String, trim: true, maxlength: 1000 },
    treatment: { type: String, trim: true, maxlength: 1000 },
    reviewedAt: Date,
  },
  { timestamps: true }
);

diseaseReportSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);
