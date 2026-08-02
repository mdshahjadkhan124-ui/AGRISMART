const rateLimit = require('express-rate-limit');
const env = require('../config/env');

// Tighter than the general /api limiter — auth endpoints are the usual
// target for credential-stuffing. Effectively disabled under the test
// suite, which legitimately hits /auth far more than 20 times per run.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.nodeEnv === 'test' ? 100000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: 'Too many attempts, please try again later.' },
});

module.exports = { authLimiter };
