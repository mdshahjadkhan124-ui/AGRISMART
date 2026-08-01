const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const weatherService = require('../services/weather.service');

const getCurrent = asyncHandler(async (req, res) => {
  const { lat, lon, farmId } = req.validatedQuery;
  const weather = await weatherService.getCurrentWeather({ lat, lon, userId: req.user.id, farmId });
  res.status(200).json(new ApiResponse(200, { weather }));
});

const getForecast = asyncHandler(async (req, res) => {
  const { lat, lon, farmId } = req.validatedQuery;
  const forecast = await weatherService.getForecast({ lat, lon, userId: req.user.id, farmId });
  res.status(200).json(new ApiResponse(200, { forecast }));
});

module.exports = { getCurrent, getForecast };
