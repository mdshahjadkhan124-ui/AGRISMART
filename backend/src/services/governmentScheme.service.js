const GovernmentScheme = require('../models/GovernmentScheme.model');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

async function createScheme(userId, data) {
  return GovernmentScheme.create({ ...data, createdBy: userId });
}

// Schemes are a shared government resource, not personal data — any gov
// admin or super admin can edit/delete any scheme, not just ones they
// personally created.
async function updateScheme(schemeId, data) {
  const scheme = await GovernmentScheme.findById(schemeId);
  if (!scheme) throw new ApiError(404, 'Scheme not found');
  Object.assign(scheme, data);
  await scheme.save();
  return scheme;
}

async function deleteScheme(schemeId) {
  const result = await GovernmentScheme.deleteOne({ _id: schemeId });
  if (result.deletedCount === 0) throw new ApiError(404, 'Scheme not found');
}

async function listSchemes(query, { includeInactive = false } = {}) {
  const { page, limit, skip } = getPagination(query);
  const filter = includeInactive ? {} : { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.state) filter.state = query.state;
  if (query.search) filter.$text = { $search: query.search };

  const [items, total] = await Promise.all([
    GovernmentScheme.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    GovernmentScheme.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ page, limit }, total) };
}

async function getScheme(schemeId) {
  const scheme = await GovernmentScheme.findById(schemeId);
  if (!scheme) throw new ApiError(404, 'Scheme not found');
  return scheme;
}

module.exports = { createScheme, updateScheme, deleteScheme, listSchemes, getScheme };
