const env = require('../config/env');
const parseDurationMs = require('./parseDuration');

const REFRESH_COOKIE_NAME = 'refreshToken';

const baseCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
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
