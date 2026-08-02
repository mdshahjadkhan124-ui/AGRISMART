const env = require('../config/env');
const parseDurationMs = require('./parseDuration');

const REFRESH_COOKIE_NAME = 'refreshToken';

// In production the frontend (Vercel) and backend (Render) are different
// origins, so the refresh cookie must be SameSite=None to be sent on
// cross-site fetch/XHR requests — SameSite=Lax is only sent on top-level
// navigation, which would silently break session refresh in production.
// Browsers require Secure whenever SameSite=None, which is already true in
// production. Locally, frontend and backend share the same-site localhost
// origin, so Lax (the safer default) still works there.
const isProduction = env.nodeEnv === 'production';
const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/api/v1/auth',
};

function setRefreshCookie(res, rawToken) {
  res.cookie(REFRESH_COOKIE_NAME, rawToken, {
    ...baseCookieOptions,
    maxAge: parseDurationMs(env.jwtRefreshExpiry),
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
}

module.exports = { REFRESH_COOKIE_NAME, setRefreshCookie, clearRefreshCookie };
