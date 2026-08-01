const twilio = require('twilio');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');
const { ROLES } = require('../config/roles');
const authService = require('./auth.service');

function isConfigured() {
  return Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioServiceSid);
}

function getClient() {
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
}

async function requestOtp(phone) {
  if (!isConfigured()) {
    throw new ApiError(501, 'OTP login is not configured yet. Set TWILIO_* variables in backend/.env.');
  }
  await getClient().verify.v2.services(env.twilioServiceSid).verifications.create({ to: phone, channel: 'sms' });
}

// On successful verification, finds or creates a user by phone number.
// New phone-only accounts default to the farmer role, same as email
// registration and Google sign-in.
async function verifyOtp(phone, code, meta) {
  if (!isConfigured()) {
    throw new ApiError(501, 'OTP login is not configured yet. Set TWILIO_* variables in backend/.env.');
  }

  const check = await getClient().verify.v2.services(env.twilioServiceSid).verificationChecks.create({ to: phone, code });

  if (check.status !== 'approved') {
    throw new ApiError(401, 'Invalid or expired OTP');
  }

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ name: phone, phone, role: ROLES.FARMER, isEmailVerified: false });
  }

  const tokens = await authService.issueSession(user, meta);
  return { user, ...tokens };
}

module.exports = { isConfigured, requestOtp, verifyOtp };
