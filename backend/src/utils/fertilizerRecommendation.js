const { NUTRIENT_BRACKETS } = require('./soilHealthScore');

// Rule-based fertilizer + dosage mapping, keyed by the same low/medium/high
// nutrient brackets used for the soil health score, so "low nitrogen" means
// the same thing everywhere in the app. Dosages are broad per-acre
// guidelines, not a prescription — always noted as such to the farmer.
const FERTILIZER_TABLE = {
  nitrogen: {
    Low: { fertilizer: 'Urea (46% N)', dosageKgPerAcre: 120, note: 'Apply in 2-3 split doses through the growing season for best uptake.' },
    Medium: { fertilizer: 'Urea (46% N)', dosageKgPerAcre: 60, note: 'A single maintenance dose is usually sufficient.' },
    High: { fertilizer: 'None', dosageKgPerAcre: 0, note: 'Nitrogen is already sufficient — avoid further nitrogenous fertilizer this season.' },
  },
  phosphorus: {
    Low: { fertilizer: 'DAP (18-46-0) or SSP', dosageKgPerAcre: 50, note: 'Apply at sowing; phosphorus does not move well in soil, so place it near the root zone.' },
    Medium: { fertilizer: 'SSP', dosageKgPerAcre: 25, note: 'A maintenance dose at sowing is enough.' },
    High: { fertilizer: 'None', dosageKgPerAcre: 0, note: 'Phosphorus is already sufficient — skip phosphatic fertilizer this season.' },
  },
  potassium: {
    Low: { fertilizer: 'MOP (Muriate of Potash)', dosageKgPerAcre: 40, note: 'Improves root strength, grain filling, and disease resistance.' },
    Medium: { fertilizer: 'MOP (Muriate of Potash)', dosageKgPerAcre: 20, note: 'A maintenance dose is sufficient.' },
    High: { fertilizer: 'None', dosageKgPerAcre: 0, note: 'Potassium is already sufficient — skip potassic fertilizer this season.' },
  },
};

function classifyLevel(value, { low, medium }) {
  if (value < low) return 'Low';
  if (value <= medium) return 'Medium';
  return 'High';
}

function getPhAmendment(ph) {
  if (ph < 5.5) return { amendment: 'Agricultural lime', dosageKgPerAcre: 400, note: 'Soil is strongly acidic — lime is needed to raise pH before planting pH-sensitive crops.' };
  if (ph < 6.0) return { amendment: 'Agricultural lime', dosageKgPerAcre: 150, note: 'Soil is mildly acidic — a light lime application can help.' };
  if (ph <= 7.5) return { amendment: 'None', dosageKgPerAcre: 0, note: 'pH is in the ideal neutral range — no amendment needed.' };
  if (ph <= 8.5) return { amendment: 'Gypsum', dosageKgPerAcre: 150, note: 'Soil is mildly alkaline — gypsum and organic matter can help.' };
  return { amendment: 'Gypsum', dosageKgPerAcre: 350, note: 'Soil is strongly alkaline — gypsum is needed along with organic matter.' };
}

function getFertilizerRecommendation({ nitrogen, phosphorus, potassium, ph }) {
  const levels = {
    nitrogen: classifyLevel(nitrogen, NUTRIENT_BRACKETS.nitrogen),
    phosphorus: classifyLevel(phosphorus, NUTRIENT_BRACKETS.phosphorus),
    potassium: classifyLevel(potassium, NUTRIENT_BRACKETS.potassium),
  };

  return {
    levels,
    nutrients: {
      nitrogen: { level: levels.nitrogen, ...FERTILIZER_TABLE.nitrogen[levels.nitrogen] },
      phosphorus: { level: levels.phosphorus, ...FERTILIZER_TABLE.phosphorus[levels.phosphorus] },
      potassium: { level: levels.potassium, ...FERTILIZER_TABLE.potassium[levels.potassium] },
    },
    phAmendment: getPhAmendment(ph),
  };
}

module.exports = { getFertilizerRecommendation };
