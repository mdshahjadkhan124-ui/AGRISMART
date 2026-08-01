const FarmActivity = require('../models/FarmActivity.model');
const ApiError = require('../utils/ApiError');
const { getOwnedFarm } = require('./farm.service');
const { getPagination, buildMeta } = require('../utils/pagination');

async function listActivities(farmId, userId, query) {
  await getOwnedFarm(farmId, userId);
  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    FarmActivity.find({ farm: farmId }).sort({ date: -1 }).skip(skip).limit(limit),
    FarmActivity.countDocuments({ farm: farmId }),
  ]);

  return { items, meta: buildMeta({ page, limit }, total) };
}

async function addActivity(farmId, userId, data) {
  await getOwnedFarm(farmId, userId);
  return FarmActivity.create({ ...data, farm: farmId });
}

async function getOwnedActivity(farmId, activityId, userId) {
  await getOwnedFarm(farmId, userId);
  const activity = await FarmActivity.findOne({ _id: activityId, farm: farmId });
  if (!activity) throw new ApiError(404, 'Activity not found');
  return activity;
}

async function updateActivity(farmId, activityId, userId, data) {
  const activity = await getOwnedActivity(farmId, activityId, userId);
  Object.assign(activity, data);
  await activity.save();
  return activity;
}

async function deleteActivity(farmId, activityId, userId) {
  const activity = await getOwnedActivity(farmId, activityId, userId);
  await activity.deleteOne();
}

module.exports = { listActivities, addActivity, updateActivity, deleteActivity };
