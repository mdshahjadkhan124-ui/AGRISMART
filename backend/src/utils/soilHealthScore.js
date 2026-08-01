// Deterministic, rule-based soil fertility scorer — no ML. Nutrient
// brackets follow standard low/medium/high soil-test ranges (kg/ha) used
// by Indian state agriculture departments' soil health card scheme.
const NUTRIENT_BRACKETS = {
  nitrogen: { low: 280, medium: 560 },
  phosphorus: { low: 10, medium: 24.6 },
  potassium: { low: 108, medium: 280 },
};

function scoreNutrient(value, { low, medium }) {
  if (value < low) return 40;
  if (value <= medium) return 85;
  return 65; // excess is also sub-optimal, just less severe than deficiency
}

function scorePh(ph) {
  if (ph < 5.5) return 30;
  if (ph < 6.0) return 60;
  if (ph <= 7.5) return 100;
  if (ph <= 8.5) return 60;
  return 30;
}

function scoreOrganicCarbon(oc) {
  if (oc < 0.5) return 40;
  if (oc <= 0.75) return 75;
  return 100;
}

function labelForScore(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function buildRecommendations({ nitrogen, phosphorus, potassium, ph, organicCarbon }) {
  const tips = [];
  const n = NUTRIENT_BRACKETS.nitrogen;
  const p = NUTRIENT_BRACKETS.phosphorus;
  const k = NUTRIENT_BRACKETS.potassium;

  if (nitrogen < n.low) tips.push('Nitrogen is low. Apply urea or well-composted manure before the next sowing.');
  else if (nitrogen > n.medium) tips.push('Nitrogen is on the higher side — avoid over-application of nitrogenous fertilizers this season.');

  if (phosphorus < p.low) tips.push('Phosphorus is low. Apply single super phosphate (SSP) or DAP as per soil test recommendation.');
  else if (phosphorus > p.medium) tips.push('Phosphorus is on the higher side — reduce phosphatic fertilizer application.');

  if (potassium < k.low) tips.push('Potassium is low. Apply muriate of potash (MOP) to improve root, tuber, and grain quality.');
  else if (potassium > k.medium) tips.push('Potassium is on the higher side — reduce potassic fertilizer application.');

  if (ph < 5.5) tips.push('Soil is strongly acidic. Apply agricultural lime to raise pH.');
  else if (ph < 6.0) tips.push('Soil is mildly acidic. Consider lime application for pH-sensitive crops.');
  else if (ph > 8.5) tips.push('Soil is strongly alkaline. Apply gypsum and organic matter to improve soil structure.');
  else if (ph > 7.5) tips.push('Soil is mildly alkaline. Adding organic matter can help.');

  if (organicCarbon != null && organicCarbon < 0.5) {
    tips.push('Organic carbon is low. Incorporate farmyard manure, compost, or green manure to improve soil structure and fertility.');
  }

  if (tips.length === 0) tips.push('Soil nutrient levels are well balanced. Maintain current fertilization practices.');

  return tips;
}

// Averages per-parameter scores (organic carbon only counted if provided)
// into a single 0-100 health score with a human-readable label and a list
// of plain-language, rule-based recommendations.
function computeSoilHealth({ nitrogen, phosphorus, potassium, ph, organicCarbon }) {
  const scores = [
    scoreNutrient(nitrogen, NUTRIENT_BRACKETS.nitrogen),
    scoreNutrient(phosphorus, NUTRIENT_BRACKETS.phosphorus),
    scoreNutrient(potassium, NUTRIENT_BRACKETS.potassium),
    scorePh(ph),
  ];
  if (organicCarbon != null) scores.push(scoreOrganicCarbon(organicCarbon));

  const healthScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

  return {
    healthScore,
    healthLabel: labelForScore(healthScore),
    recommendations: buildRecommendations({ nitrogen, phosphorus, potassium, ph, organicCarbon }),
  };
}

module.exports = { computeSoilHealth };
