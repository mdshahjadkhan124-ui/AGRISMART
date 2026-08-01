const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const adminUserService = require('../services/adminUser.service');
const auditLogService = require('../services/auditLog.service');

const listUsers = asyncHandler(async (req, res) => {
  const { items, meta } = await adminUserService.listUsers(req.query);
  res.status(200).json(new ApiResponse(200, { users: items }, 'Success', meta));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminUserService.updateUserRole(req.user.id, req.params.id, req.body.role);
  res.status(200).json(new ApiResponse(200, { user }, 'Role updated'));
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminUserService.updateUserStatus(req.user.id, req.params.id, req.body.isActive);
  res.status(200).json(new ApiResponse(200, { user }, 'Status updated'));
});

const listAuditLogs = asyncHandler(async (req, res) => {
  const { items, meta } = await auditLogService.listAuditLogs(req.query);
  res.status(200).json(new ApiResponse(200, { auditLogs: items }, 'Success', meta));
});

module.exports = { listUsers, updateUserRole, updateUserStatus, listAuditLogs };
