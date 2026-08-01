const CropSuggestion = require('../models/CropSuggestion.model');
const { suggestCrops } = require('../utils/cropSuggestion');
const { getPagination, buildMeta } = require('../utils/pagination');

async function createSuggestion(userId, { farmId, ...inputs }) {
  const results = suggestCrops(inputs, 5);
  return CropSuggestion.create({ farmer: userId, farm: farmId || undefined, inputs, results });
}

async function listHistory(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    CropSuggestion.find({ farmer: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    CropSuggestion.countDocuments({ farmer: userId }),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

module.exports = { createSuggestion, listHistory };
