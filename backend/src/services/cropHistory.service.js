const CropHistory = require('../models/CropHistory.model');
const { getOwnedFarm } = require('./farm.service');

async function listCropHistory(farmId, userId) {
  await getOwnedFarm(farmId, userId);
  return CropHistory.find({ farm: farmId }).sort({ sowingDate: -1, createdAt: -1 });
}

async function addCropHistory(farmId, userId, data) {
  await getOwnedFarm(farmId, userId);
  return CropHistory.create({ ...data, farm: farmId });
}

module.exports = { listCropHistory, addCropHistory };
