const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const farmService = require('../services/farm.service');
const cropHistoryService = require('../services/cropHistory.service');
const soilReportService = require('../services/soilReport.service');
const activityService = require('../services/farmActivity.service');

const listFarms = asyncHandler(async (req, res) => {
  const farms = await farmService.listFarms(req.user.id);
  res.status(200).json(new ApiResponse(200, { farms }));
});

const createFarm = asyncHandler(async (req, res) => {
  const farm = await farmService.createFarm(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { farm }, 'Farm created'));
});

const getFarm = asyncHandler(async (req, res) => {
  const farm = await farmService.getOwnedFarm(req.params.farmId, req.user.id);
  res.status(200).json(new ApiResponse(200, { farm }));
});

const updateFarm = asyncHandler(async (req, res) => {
  const farm = await farmService.updateFarm(req.params.farmId, req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { farm }, 'Farm updated'));
});

const deleteFarm = asyncHandler(async (req, res) => {
  await farmService.deleteFarm(req.params.farmId, req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'Farm deleted'));
});

const listCropHistory = asyncHandler(async (req, res) => {
  const cropHistory = await cropHistoryService.listCropHistory(req.params.farmId, req.user.id);
  res.status(200).json(new ApiResponse(200, { cropHistory }));
});

const addCropHistory = asyncHandler(async (req, res) => {
  const entry = await cropHistoryService.addCropHistory(req.params.farmId, req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { entry }, 'Crop history entry added'));
});

const listSoilReports = asyncHandler(async (req, res) => {
  const { items, meta } = await soilReportService.listSoilReports(req.params.farmId, req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { soilReports: items }, 'Success', meta));
});

const getLatestSoilReport = asyncHandler(async (req, res) => {
  const report = await soilReportService.getLatestSoilReport(req.params.farmId, req.user.id);
  res.status(200).json(new ApiResponse(200, { report }));
});

const addSoilReport = asyncHandler(async (req, res) => {
  const report = await soilReportService.addSoilReport(req.params.farmId, req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { report }, 'Soil report added'));
});

const listActivities = asyncHandler(async (req, res) => {
  const { items, meta } = await activityService.listActivities(req.params.farmId, req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { activities: items }, 'Success', meta));
});

const addActivity = asyncHandler(async (req, res) => {
  const activity = await activityService.addActivity(req.params.farmId, req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { activity }, 'Activity logged'));
});

const updateActivity = asyncHandler(async (req, res) => {
  const activity = await activityService.updateActivity(req.params.farmId, req.params.activityId, req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, { activity }, 'Activity updated'));
});

const deleteActivity = asyncHandler(async (req, res) => {
  await activityService.deleteActivity(req.params.farmId, req.params.activityId, req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'Activity deleted'));
});

module.exports = {
  listFarms,
  createFarm,
  getFarm,
  updateFarm,
  deleteFarm,
  listCropHistory,
  addCropHistory,
  listSoilReports,
  getLatestSoilReport,
  addSoilReport,
  listActivities,
  addActivity,
  updateActivity,
  deleteActivity,
};
