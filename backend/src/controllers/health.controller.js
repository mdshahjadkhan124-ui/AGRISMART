const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const mongoStateLabels = ['disconnected', 'connected', 'connecting', 'disconnecting'];

const getHealth = asyncHandler(async (_req, res) => {
  const dbState = mongoStateLabels[mongoose.connection.readyState] || 'unknown';

  res.status(200).json(
    new ApiResponse(200, {
      uptimeSeconds: Math.round(process.uptime()),
      database: dbState,
      timestamp: new Date().toISOString(),
    })
  );
});

module.exports = { getHealth };
