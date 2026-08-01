const FertilizerRecommendation = require('../models/FertilizerRecommendation.model');
const SoilReport = require('../models/SoilReport.model');
const ApiError = require('../utils/ApiError');
const { getOwnedFarm } = require('./farm.service');
const { getFertilizerRecommendation } = require('../utils/fertilizerRecommendation');
const { getPagination, buildMeta } = require('../utils/pagination');

// Explicit nutrient values always win; a farmId is only used to fill in
// whichever of nitrogen/phosphorus/potassium/ph the caller left out, from
// that farm's most recent soil report.
async function resolveInputs(userId, { farmId, nitrogen, phosphorus, potassium, ph }) {
  const needsLookup = [nitrogen, phosphorus, potassium, ph].some((v) => v == null);

  if (!needsLookup) return { nitrogen, phosphorus, potassium, ph };

  if (!farmId) throw new ApiError(400, 'Missing nitrogen, phosphorus, potassium, or ph, and no farmId was provided to look them up.');

  await getOwnedFarm(farmId, userId);
  const latest = await SoilReport.findOne({ farm: farmId }).sort({ testedAt: -1 });
  if (!latest) throw new ApiError(404, 'This farm has no soil reports yet — log one first, or provide values directly.');

  return {
    nitrogen: nitrogen ?? latest.nitrogen,
    phosphorus: phosphorus ?? latest.phosphorus,
    potassium: potassium ?? latest.potassium,
    ph: ph ?? latest.ph,
  };
}

async function createRecommendation(userId, { farmId, ...explicit }) {
  const inputs = await resolveInputs(userId, { farmId, ...explicit });
  const { levels, nutrients, phAmendment } = getFertilizerRecommendation(inputs);

  return FertilizerRecommendation.create({
    farmer: userId,
    farm: farmId || undefined,
    inputs,
    levels,
    nutrients,
    phAmendment,
  });
}

async function listHistory(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    FertilizerRecommendation.find({ farmer: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    FertilizerRecommendation.countDocuments({ farmer: userId }),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

module.exports = { createRecommendation, listHistory };
