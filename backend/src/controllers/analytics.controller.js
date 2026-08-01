const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/analytics.service');

const getMyAnalytics = asyncHandler(async (req, res) => {
  const analytics = await service.getAnalyticsForUser(req.user.id, req.user.role);
  res.status(200).json(new ApiResponse(200, analytics));
});

module.exports = { getMyAnalytics };
