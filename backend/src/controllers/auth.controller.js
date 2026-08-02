const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const authService = require('../services/auth.service');
const googleAuthService = require('../services/googleAuth.service');
const User = require('../models/User.model');
const { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE_NAME } = require('../utils/cookies');

function requestMeta(req) {
  return { userAgent: req.headers['user-agent'], ip: req.ip };
}

const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body, requestMeta(req));
  setRefreshCookie(res, refreshToken);
  res.status(201).json(new ApiResponse(201, { user: user.toSafeJSON(), accessToken }, 'Account created'));
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body, requestMeta(req));
  setRefreshCookie(res, refreshToken);
  res.status(200).json(new ApiResponse(200, { user: user.toSafeJSON(), accessToken }, 'Logged in'));
});

const refresh = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.[REFRESH_COOKIE_NAME];
  const { user, accessToken, refreshToken } = await authService.refreshSession(incoming, requestMeta(req));
  setRefreshCookie(res, refreshToken);
  res.status(200).json(new ApiResponse(200, { user: user.toSafeJSON(), accessToken }, 'Session refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.logoutUser(incoming);
  clearRefreshCookie(res);
  res.status(200).json(new ApiResponse(200, null, 'Logged out'));
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, { user: user.toSafeJSON() }));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await googleAuthService.loginWithGoogle(req.body.idToken, requestMeta(req));
  setRefreshCookie(res, refreshToken);
  res.status(200).json(new ApiResponse(200, { user: user.toSafeJSON(), accessToken }, 'Logged in with Google'));
});

module.exports = { register, login, refresh, logout, me, googleLogin };
