const ExpertProfile = require('../models/ExpertProfile.model');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

async function getMyProfile(userId) {
  return ExpertProfile.findOne({ user: userId });
}

async function upsertMyProfile(userId, data) {
  return ExpertProfile.findOneAndUpdate(
    { user: userId },
    { $set: data, $setOnInsert: { user: userId } },
    { new: true, upsert: true, runValidators: true }
  );
}

// Public-facing directory: only experts who have set up a profile appear,
// which nudges experts to complete one before farmers can find them.
async function listExperts(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.availableOnly === 'true') filter.isAvailable = true;

  const [items, total] = await Promise.all([
    ExpertProfile.find(filter)
      .populate('user', 'name email avatarUrl isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ExpertProfile.countDocuments(filter),
  ]);

  return { items: items.filter((profile) => profile.user?.isActive), meta: buildMeta({ page, limit }, total) };
}

async function getExpertById(expertProfileId) {
  const profile = await ExpertProfile.findById(expertProfileId).populate('user', 'name email avatarUrl isActive');
  if (!profile || !profile.user?.isActive) throw new ApiError(404, 'Expert not found');
  return profile;
}

module.exports = { getMyProfile, upsertMyProfile, listExperts, getExpertById };
