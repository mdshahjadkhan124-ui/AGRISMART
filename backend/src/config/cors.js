const env = require('./env');

const localhostRegex = /^http:\/\/localhost:\d+$/;

// CORS_ORIGIN may be a single URL or a comma-separated list (e.g. an apex
// domain plus a www subdomain, or while migrating between two frontend
// URLs) — one deployed frontend is the common case, but this costs nothing
// extra to support.
const allowedOrigins = env.corsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Dev servers commonly land on a different port than the default (5173)
// when it's busy, so in development any http://localhost:<port> origin is
// allowed rather than hardcoding one. In production only the explicitly
// configured CORS_ORIGIN(s) are allowed. Shared by both Express (cors
// package) and Socket.IO, which accept the same (origin, callback) shape.
function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true); // non-browser requests: curl, server-to-server, same-origin

  if (env.nodeEnv !== 'production' && localhostRegex.test(origin)) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`Origin ${origin} not allowed by CORS`));
}

module.exports = { corsOrigin };
