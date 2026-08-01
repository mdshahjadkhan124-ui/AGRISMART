const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');
const { ROLES } = require('../config/roles');
const authService = require('./auth.service');

function isConfigured() {
  return Boolean(env.googleClientId);
}

// Verifies a Google ID token from the frontend, then finds or creates the
// matching local user. Google-authenticated users never get a local
// password, so they can only ever sign in via this path.
async function loginWithGoogle(idToken, meta) {
  if (!isConfigured()) {
    throw new ApiError(501, 'Google OAuth is not configured yet. Set GOOGLE_CLIENT_ID in backend/.env.');
  }

  const client = new OAuth2Client(env.googleClientId);
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: env.googleClientId });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, 'Invalid Google token');
  }

  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email,
      email: payload.email,
      googleId: payload.sub,
      authProvider: 'google',
      isEmailVerified: Boolean(payload.email_verified),
      avatarUrl: payload.picture || '',
      role: ROLES.FARMER,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.authProvider = 'google';
    await user.save();
  }

  const tokens = await authService.issueSession(user, meta);
  return { user, ...tokens };
}

module.exports = { isConfigured, loginWithGoogle };
