const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/cropSuggestion.service');

const create = asyncHandler(async (req, res) => {
  const suggestion = await service.createSuggestion(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { suggestion }, 'Crop suggestions generated'));
});

const listHistory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listHistory(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { suggestions: items }, 'Success', meta));
});

module.exports = { create, listHistory };
