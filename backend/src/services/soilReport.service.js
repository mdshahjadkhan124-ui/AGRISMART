const SoilReport = require('../models/SoilReport.model');
const ApiError = require('../utils/ApiError');
const { getOwnedFarm } = require('./farm.service');
const { computeSoilHealth } = require('../utils/soilHealthScore');
const { getPagination, buildMeta } = require('../utils/pagination');

async function listSoilReports(farmId, userId, query) {
  await getOwnedFarm(farmId, userId);
  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    SoilReport.find({ farm: farmId }).sort({ testedAt: -1 }).skip(skip).limit(limit),
    SoilReport.countDocuments({ farm: farmId }),
  ]);

  return { items, meta: buildMeta({ page, limit }, total) };
}

async function getLatestSoilReport(farmId, userId) {
  await getOwnedFarm(farmId, userId);
  const report = await SoilReport.findOne({ farm: farmId }).sort({ testedAt: -1 });
  if (!report) throw new ApiError(404, 'No soil reports found for this farm yet');
  return report;
}

async function addSoilReport(farmId, userId, data) {
  await getOwnedFarm(farmId, userId);
  const { healthScore, healthLabel, recommendations } = computeSoilHealth(data);
  return SoilReport.create({ ...data, farm: farmId, healthScore, healthLabel, recommendations });
}

module.exports = { listSoilReports, getLatestSoilReport, addSoilReport };
