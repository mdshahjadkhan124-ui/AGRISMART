const FarmerProfile = require('../models/FarmerProfile.model');

async function getMyProfile(userId) {
  return FarmerProfile.findOne({ user: userId });
}

async function upsertMyProfile(userId, data) {
  return FarmerProfile.findOneAndUpdate(
    { user: userId },
    { $set: data, $setOnInsert: { user: userId } },
    { new: true, upsert: true, runValidators: true }
  );
}

module.exports = { getMyProfile, upsertMyProfile };
