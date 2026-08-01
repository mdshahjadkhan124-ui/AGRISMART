const Notification = require('../models/Notification.model');
const ApiError = require('../utils/ApiError');
const { getPagination, buildMeta } = require('../utils/pagination');

// Every notification is persisted first (so it survives being offline),
// then pushed over Socket.IO if the recipient is currently connected.
// Socket.IO isn't required to have started yet (e.g. when this runs from
// a script), so a missing/uninitialized io is a silent no-op, not an error.
async function notify({ userId, type, title, message, link }) {
  const notification = await Notification.create({ user: userId, type, title, message, link });

  try {
    const { getIO } = require('../sockets');
    getIO()
      .to(`user:${userId}`)
      .emit('notification:new', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        createdAt: notification.createdAt,
      });
  } catch {
    // Socket.IO not initialized or recipient offline — the notification
    // is already saved, so it'll show up next time they fetch the list.
  }

  return notification;
}

async function listMyNotifications(userId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);
  return { items, meta: { ...buildMeta({ page, limit }, total), unreadCount } };
}

async function markAsRead(userId, notificationId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
}

async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}

module.exports = { notify, listMyNotifications, markAsRead, markAllAsRead };
