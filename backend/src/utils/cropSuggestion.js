const CROPS = require('../data/cropSuitability');

const PARAMETERS = ['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall'];

const PARAMETER_LABELS = {
  n: 'Nitrogen',
  p: 'Phosphorus',
  k: 'Potassium',
  temperature: 'Temperature',
  humidity: 'Humidity',
  ph: 'pH',
  rainfall: 'Rainfall',
};

// A value inside [min, max] scores 100. Outside the range, the score falls
// off linearly with distance (as a fraction of the range width), floored
// at 0 — a deterministic closeness measure, not a trained model.
function scoreParameter(value, [min, max]) {
  if (value >= min && value <= max) return 100;
  const width = max - min || 1;
  const distance = value < min ? min - value : value - max;
  return Math.max(0, Math.round(100 - (distance / width) * 100));
}

function matchCrop(input, crop) {
  const parameterScores = PARAMETERS.map((key) => ({
    key,
    label: PARAMETER_LABELS[key],
    score: scoreParameter(input[key], crop[key]),
    inRange: input[key] >= crop[key][0] && input[key] <= crop[key][1],
  }));

  const score = Math.round(parameterScores.reduce((sum, p) => sum + p.score, 0) / parameterScores.length);
  const outOfRange = parameterScores.filter((p) => !p.inRange).map((p) => p.label);

  return {
    cropName: crop.name,
    season: crop.season,
    score,
    waterRequirement: crop.waterRequirement,
    expectedYieldPerAcre: crop.expectedYieldPerAcre,
    expectedProfitPerAcreInr: crop.expectedProfitPerAcreInr,
    outOfRangeFactors: outOfRange,
  };
}

// Ranks every crop in the static lookup table by closeness to the given
// soil/climate inputs and returns the top N matches, most suitable first.
function suggestCrops(input, topN = 5) {
  return CROPS.map((crop) => matchCrop(input, crop))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

module.exports = { suggestCrops };
