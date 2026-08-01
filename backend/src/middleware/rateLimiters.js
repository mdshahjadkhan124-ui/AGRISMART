const rateLimit = require('express-rate-limit');

// Tighter than the general /api limiter — auth endpoints are the usual
// target for credential-stuffing and OTP-spam abuse.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: 'Too many attempts, please try again later.' },
});

module.exports = { authLimiter };
