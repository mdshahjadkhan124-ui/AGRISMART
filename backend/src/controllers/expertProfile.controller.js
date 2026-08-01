const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/expertProfile.service');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await service.getMyProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, { profile }));
});

const upsertMyProfile = asyncHandler(async (req, res) => {
  const profile = await service.upsertMyProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { profile }, 'Profile saved'));
});

const listExperts = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listExperts(req.query);
  res.status(200).json(new ApiResponse(200, { experts: items }, 'Success', meta));
});

const getExpertById = asyncHandler(async (req, res) => {
  const expert = await service.getExpertById(req.params.id);
  res.status(200).json(new ApiResponse(200, { expert }));
});

module.exports = { getMyProfile, upsertMyProfile, listExperts, getExpertById };
