// Thrown deliberately from controllers/services for expected failure cases
// (bad input, not found, unauthorized, etc). Caught by the global error
// handler and turned into the standard error response shape.
class ApiError extends Error {
  constructor(statusCode, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
