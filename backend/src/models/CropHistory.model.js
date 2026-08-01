const mongoose = require('mongoose');

const cropHistorySchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    cropName: { type: String, required: [true, 'Crop name is required'], trim: true, maxlength: 100 },
    season: { type: String, enum: ['kharif', 'rabi', 'zaid', 'perennial'], required: true },
    sowingDate: { type: Date },
    harvestDate: { type: Date },
    yieldQuantityKg: { type: Number, min: 0 },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropHistory', cropHistorySchema);
