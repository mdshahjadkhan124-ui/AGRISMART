const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const auditLogService = require('./auditLog.service');
const notificationService = require('./notification.service');
const { getPagination, buildMeta } = require('../utils/pagination');

async function listUsers(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { items: items.map((u) => u.toSafeJSON()), meta: buildMeta({ page, limit }, total) };
}

async function updateUserRole(actorId, targetUserId, newRole) {
  if (actorId === targetUserId) throw new ApiError(400, 'You cannot change your own role');

  const user = await User.findById(targetUserId);
  if (!user) throw new ApiError(404, 'User not found');

  const previousRole = user.role;
  user.role = newRole;
  await user.save();

  await auditLogService.log({
    actorId,
    action: 'user.role_changed',
    targetType: 'User',
    targetId: user._id,
    metadata: { from: previousRole, to: newRole },
  });

  await notificationService.notify({
    userId: user._id.toString(),
    type: 'system',
    title: 'Your role was updated',
    message: `Your account role changed from ${previousRole} to ${newRole}.`,
    link: '/dashboard',
  });

  return user.toSafeJSON();
}

async function updateUserStatus(actorId, targetUserId, isActive) {
  if (actorId === targetUserId) throw new ApiError(400, 'You cannot change your own account status');

  const user = await User.findById(targetUserId);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = isActive;
  await user.save();

  await auditLogService.log({
    actorId,
    action: isActive ? 'user.activated' : 'user.deactivated',
    targetType: 'User',
    targetId: user._id,
    metadata: {},
  });

  return user.toSafeJSON();
}

module.exports = { listUsers, updateUserRole, updateUserStatus };
