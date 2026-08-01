const { Server } = require('socket.io');
const env = require('../config/env');
const logger = require('../config/logger');

// Real-time notifications, chat, typing indicators, and online-status are
// wired up in Phase 6. For now this just establishes the connection so the
// transport is verified end-to-end.
function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initSocket;
