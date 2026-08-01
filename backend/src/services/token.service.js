const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const parseDurationMs = require('../utils/parseDuration');
const RefreshToken = require('../models/RefreshToken.model');

function generateAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiry,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// Issues a brand new opaque refresh token (not a JWT) and stores only its
// hash. `replacesHash` links it into the rotation chain of the token it
// replaces, so a reused/stolen token can be detected later.
async function issueRefreshToken(userId, { userAgent, ip, replacesHash = null } = {}) {
  const rawToken = crypto.randomBytes(64).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + parseDurationMs(env.jwtRefreshExpiry));

  await RefreshToken.create({ user: userId, tokenHash, expiresAt, userAgent, ip });

  if (replacesHash) {
    await RefreshToken.updateOne({ tokenHash: replacesHash }, { revoked: true, replacedByTokenHash: tokenHash });
  }

  return rawToken;
}

// Verifies a raw refresh token against the stored hash, rotates it (revokes
// the old one, issues a new one), and returns the associated user id plus
// the new raw token. Reuse of an already-revoked token revokes the whole
// token family for that user as a precaution against token theft.
async function rotateRefreshToken(rawToken, meta = {}) {
  const tokenHash = hashToken(rawToken);
  const existing = await RefreshToken.findOne({ tokenHash });

  if (!existing) {
    return { error: 'INVALID' };
  }

  if (existing.revoked || existing.expiresAt < new Date()) {
    await RefreshToken.updateMany({ user: existing.user, revoked: false }, { revoked: true });
    return { error: 'REUSED_OR_EXPIRED' };
  }

  const newRawToken = await issueRefreshToken(existing.user, { ...meta, replacesHash: tokenHash });
  return { userId: existing.user, rawToken: newRawToken };
}

async function revokeRefreshToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  await RefreshToken.updateOne({ tokenHash }, { revoked: true });
}

async function revokeAllRefreshTokensForUser(userId) {
  await RefreshToken.updateMany({ user: userId, revoked: false }, { revoked: true });
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokensForUser,
};
