const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/fertilizerRecommendation.service');

const create = asyncHandler(async (req, res) => {
  const recommendation = await service.createRecommendation(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { recommendation }, 'Fertilizer recommendation generated'));
});

const listHistory = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listHistory(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { recommendations: items }, 'Success', meta));
});

module.exports = { create, listHistory };
