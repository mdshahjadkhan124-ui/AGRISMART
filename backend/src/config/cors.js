const env = require('./env');

const localhostRegex = /^http:\/\/localhost:\d+$/;

// Dev servers commonly land on a different port than the default (5173)
// when it's busy, so in development any http://localhost:<port> origin is
// allowed rather than hardcoding one. In production only the explicitly
// configured CORS_ORIGIN is allowed. Shared by both Express (cors package)
// and Socket.IO, which accept the same (origin, callback) function shape.
function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true); // non-browser requests: curl, server-to-server, same-origin

  if (env.nodeEnv !== 'production' && localhostRegex.test(origin)) {
    return callback(null, true);
  }

  if (origin === env.corsOrigin) {
    return callback(null, true);
  }

  return callback(new Error(`Origin ${origin} not allowed by CORS`));
}

module.exports = { corsOrigin };
