const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    // Nutrient levels in kg/ha, as reported by a manual soil test.
    nitrogen: { type: Number, required: true, min: 0 },
    phosphorus: { type: Number, required: true, min: 0 },
    potassium: { type: Number, required: true, min: 0 },
    ph: { type: Number, required: true, min: 0, max: 14 },
    organicCarbon: { type: Number, min: 0, max: 100 },
    moisturePercent: { type: Number, min: 0, max: 100 },
    testedAt: { type: Date, default: Date.now },
    // Computed at creation time by the rule-based scorer (services/soilHealthScore.js).
    healthScore: { type: Number, min: 0, max: 100, required: true },
    healthLabel: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'], required: true },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

soilReportSchema.index({ farm: 1, testedAt: -1 });

module.exports = mongoose.model('SoilReport', soilReportSchema);
