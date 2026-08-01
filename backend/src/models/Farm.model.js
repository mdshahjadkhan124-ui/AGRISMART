const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: [true, 'Farm name is required'], trim: true, maxlength: 100 },
    areaAcres: { type: Number, required: [true, 'Farm area is required'], min: 0.01 },
    soilType: {
      type: String,
      enum: ['alluvial', 'black', 'red', 'laterite', 'arid', 'saline', 'peaty', 'forest', 'other'],
      default: 'other',
    },
    irrigationType: {
      type: String,
      enum: ['canal', 'borewell', 'drip', 'sprinkler', 'rainfed', 'other'],
      default: 'rainfed',
    },
    location: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
      address: { type: String, trim: true, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
