const { Server } = require('socket.io');
const logger = require('../config/logger');
const tokenService = require('../services/token.service');
const { corsOrigin } = require('../config/cors');

let ioInstance = null;
// userId -> Set of socket ids, so the same user can have multiple tabs/devices open.
const onlineUsers = new Map();

function markOnline(userId, socketId) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
}

function markOffline(userId, socketId) {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(userId);
}

function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

function getIO() {
  if (!ioInstance) throw new Error('Socket.IO has not been initialized yet');
  return ioInstance;
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true,
    },
  });

  // Every socket must present a valid access token at connect time (same
  // JWT used for REST calls). Note: unlike REST requests, a socket
  // connection is long-lived and isn't re-validated after the token
  // expires — acceptable for this app's scope, but a production system
  // would want the client to reconnect with a refreshed token.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = tokenService.verifyAccessToken(token);
      socket.userId = payload.sub;
      socket.userRole = payload.role;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (user ${socket.userId})`);
    socket.join(`user:${socket.userId}`);
    markOnline(socket.userId, socket.id);

    // Ownership is re-checked on every join — a socket can only listen to
    // an appointment's chat room if the connected user is one of its two
    // participants. Requiring here (not at module load) avoids a circular
    // require with chat.service.js, which needs getIO() from this module.
    socket.on('chat:join', async (appointmentId, callback) => {
      try {
        const { getOwnedAppointment } = require('../services/appointment.service');
        const { appointment } = await getOwnedAppointment(appointmentId, socket.userId);
        socket.join(`appointment:${appointmentId}`);
        const otherUserId =
          appointment.farmer._id.toString() === socket.userId
            ? appointment.expert._id.toString()
            : appointment.farmer._id.toString();
        callback?.({ ok: true, otherOnline: isUserOnline(otherUserId) });
      } catch (err) {
        callback?.({ ok: false, error: err.message });
      }
    });

    socket.on('chat:typing', ({ appointmentId }) => {
      if (!appointmentId) return;
      socket.to(`appointment:${appointmentId}`).emit('chat:typing', { userId: socket.userId });
    });

    socket.on('disconnect', () => {
      markOffline(socket.userId, socket.id);
      logger.info(`Socket disconnected: ${socket.id} (user ${socket.userId})`);
    });
  });

  ioInstance = io;
  return io;
}

module.exports = initSocket;
module.exports.getIO = getIO;
module.exports.isUserOnline = isUserOnline;
