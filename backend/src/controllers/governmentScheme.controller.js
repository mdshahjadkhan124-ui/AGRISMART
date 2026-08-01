const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/governmentScheme.service');
const { ROLES } = require('../config/roles');

const isSchemeManager = (role) => role === ROLES.GOV_ADMIN || role === ROLES.SUPER_ADMIN;

const listSchemes = asyncHandler(async (req, res) => {
  const includeInactive = isSchemeManager(req.user.role) && req.query.includeInactive === 'true';
  const { items, meta } = await service.listSchemes(req.query, { includeInactive });
  res.status(200).json(new ApiResponse(200, { schemes: items }, 'Success', meta));
});

const getScheme = asyncHandler(async (req, res) => {
  const scheme = await service.getScheme(req.params.id);
  res.status(200).json(new ApiResponse(200, { scheme }));
});

const createScheme = asyncHandler(async (req, res) => {
  const scheme = await service.createScheme(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { scheme }, 'Scheme published'));
});

const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await service.updateScheme(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { scheme }, 'Scheme updated'));
});

const deleteScheme = asyncHandler(async (req, res) => {
  await service.deleteScheme(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Scheme deleted'));
});

module.exports = { listSchemes, getScheme, createScheme, updateScheme, deleteScheme };
