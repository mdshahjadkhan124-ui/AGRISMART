const mongoose = require('mongoose');

const farmActivitySchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['sowing', 'irrigation', 'fertilizing', 'pesticide_spray', 'weeding', 'harvesting', 'soil_testing', 'other'],
      required: true,
    },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    date: { type: Date, required: true, default: Date.now },
    costInr: { type: Number, min: 0 },
  },
  { timestamps: true }
);

farmActivitySchema.index({ farm: 1, date: -1 });

module.exports = mongoose.model('FarmActivity', farmActivitySchema);
