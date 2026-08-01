const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/notification.service');

const listMyNotifications = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyNotifications(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { notifications: items }, 'Success', meta));
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await service.markAsRead(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, { notification }));
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await service.markAllAsRead(req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

module.exports = { listMyNotifications, markAsRead, markAllAsRead };
