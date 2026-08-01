const mongoose = require('mongoose');

// A lightweight history of weather lookups (not a cache) — lets a farmer
// see conditions at the time of past farm activities and gives officers /
// analytics dashboards a record of weather queries per region.
const weatherLogSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    type: { type: String, enum: ['current', 'forecast'], required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    locationName: { type: String, trim: true, default: '' },
    summary: {
      temperatureC: Number,
      feelsLikeC: Number,
      humidityPercent: Number,
      windSpeedMs: Number,
      condition: String,
    },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherLog', weatherLogSchema);
