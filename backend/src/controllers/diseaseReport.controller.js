const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/diseaseReport.service');

const createReport = asyncHandler(async (req, res) => {
  const report = await service.createReport(req.user.id, req.body, req.file);
  res.status(201).json(new ApiResponse(201, { report }, 'Report submitted for expert review'));
});

const listMyReports = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyReports(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { reports: items }, 'Success', meta));
});

const getMyReport = asyncHandler(async (req, res) => {
  const report = await service.getMyReport(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, { report }));
});

const listQueue = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listQueue(req.query);
  res.status(200).json(new ApiResponse(200, { reports: items }, 'Success', meta));
});

const respondToReport = asyncHandler(async (req, res) => {
  const report = await service.respondToReport(req.user.id, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { report }, 'Response submitted'));
});

module.exports = { createReport, listMyReports, getMyReport, listQueue, respondToReport };
