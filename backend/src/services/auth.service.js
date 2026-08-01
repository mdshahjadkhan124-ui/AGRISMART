const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/roles');
const tokenService = require('./token.service');

async function issueSession(user, meta) {
  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = await tokenService.issueRefreshToken(user._id, meta);
  return { accessToken, refreshToken };
}

// Public registration always creates a farmer account. Every other role
// (expert, officer, seller, gov_admin, super_admin) is provisioned by an
// admin or the seed script — a client can never grant itself elevated
// access by sending a different `role` value.
async function registerUser({ name, email, password, phone }, meta) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ name, email, password, phone, role: ROLES.FARMER });
  const tokens = await issueSession(user, meta);
  return { user, ...tokens };
}

async function loginUser({ email, password }, meta) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'This account has been deactivated');

  const tokens = await issueSession(user, meta);
  return { user, ...tokens };
}

async function refreshSession(rawRefreshToken, meta) {
  if (!rawRefreshToken) throw new ApiError(401, 'Missing refresh token');

  const result = await tokenService.rotateRefreshToken(rawRefreshToken, meta);
  if (result.error) throw new ApiError(401, 'Invalid or expired refresh token');

  const user = await User.findById(result.userId);
  if (!user || !user.isActive) throw new ApiError(401, 'Account no longer available');

  const accessToken = tokenService.generateAccessToken(user);
  return { user, accessToken, refreshToken: result.rawToken };
}

async function logoutUser(rawRefreshToken) {
  if (rawRefreshToken) await tokenService.revokeRefreshToken(rawRefreshToken);
}

module.exports = { registerUser, loginUser, refreshSession, logoutUser, issueSession };
