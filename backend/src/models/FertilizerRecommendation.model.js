const mongoose = require('mongoose');

const fertilizerRecommendationSchema = new mongoose.Schema(
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
    inputs: {
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      potassium: { type: Number, required: true },
      ph: { type: Number, required: true },
    },
    levels: {
      nitrogen: String,
      phosphorus: String,
      potassium: String,
    },
    nutrients: {
      nitrogen: { level: String, fertilizer: String, dosageKgPerAcre: Number, note: String },
      phosphorus: { level: String, fertilizer: String, dosageKgPerAcre: Number, note: String },
      potassium: { level: String, fertilizer: String, dosageKgPerAcre: Number, note: String },
    },
    phAmendment: {
      amendment: String,
      dosageKgPerAcre: Number,
      note: String,
    },
  },
  { timestamps: true }
);

fertilizerRecommendationSchema.index({ farmer: 1, createdAt: -1 });

module.exports = mongoose.model('FertilizerRecommendation', fertilizerRecommendationSchema);
