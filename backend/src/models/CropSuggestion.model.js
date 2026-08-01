const mongoose = require('mongoose');

const cropSuggestionSchema = new mongoose.Schema(
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
      n: { type: Number, required: true },
      p: { type: Number, required: true },
      k: { type: Number, required: true },
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      ph: { type: Number, required: true },
      rainfall: { type: Number, required: true },
    },
    results: [
      {
        _id: false,
        cropName: String,
        season: String,
        score: Number,
        waterRequirement: String,
        expectedYieldPerAcre: String,
        expectedProfitPerAcreInr: Number,
        outOfRangeFactors: [String],
      },
    ],
  },
  { timestamps: true }
);

cropSuggestionSchema.index({ farmer: 1, createdAt: -1 });

module.exports = mongoose.model('CropSuggestion', cropSuggestionSchema);
