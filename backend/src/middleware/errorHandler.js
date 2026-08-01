const env = require('../config/env');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

// Must be registered last. Express recognizes it as an error handler because
// it declares four parameters.
function errorHandler(err, req, res, _next) {
  let { statusCode, message, details } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal server error';
    details = [];
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => e.message);
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate value';
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode || 500).json({
    success: false,
    statusCode: statusCode || 500,
    message: message || 'Internal server error',
    details: details || [],
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
