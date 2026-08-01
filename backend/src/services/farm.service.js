const Farm = require('../models/Farm.model');
const CropHistory = require('../models/CropHistory.model');
const SoilReport = require('../models/SoilReport.model');
const FarmActivity = require('../models/FarmActivity.model');
const ApiError = require('../utils/ApiError');

// Shared ownership check reused by every farm-scoped resource (crop
// history, soil reports, activities) so a farmer can never read or write
// another farmer's data by guessing an id.
async function getOwnedFarm(farmId, userId) {
  const farm = await Farm.findById(farmId);
  if (!farm) throw new ApiError(404, 'Farm not found');
  if (farm.farmer.toString() !== userId) throw new ApiError(403, 'You do not have access to this farm');
  return farm;
}

async function listFarms(userId) {
  return Farm.find({ farmer: userId }).sort({ createdAt: -1 });
}

async function createFarm(userId, data) {
  return Farm.create({ ...data, farmer: userId });
}

async function updateFarm(farmId, userId, data) {
  const farm = await getOwnedFarm(farmId, userId);
  Object.assign(farm, data);
  await farm.save();
  return farm;
}

async function deleteFarm(farmId, userId) {
  await getOwnedFarm(farmId, userId);
  await Promise.all([
    Farm.deleteOne({ _id: farmId }),
    CropHistory.deleteMany({ farm: farmId }),
    SoilReport.deleteMany({ farm: farmId }),
    FarmActivity.deleteMany({ farm: farmId }),
  ]);
}

module.exports = { getOwnedFarm, listFarms, createFarm, updateFarm, deleteFarm };
