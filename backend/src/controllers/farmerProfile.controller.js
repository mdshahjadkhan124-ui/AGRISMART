const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const profileService = require('../services/farmerProfile.service');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getMyProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, { profile }));
});

const upsertMyProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.upsertMyProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { profile }, 'Profile saved'));
});

module.exports = { getMyProfile, upsertMyProfile };
