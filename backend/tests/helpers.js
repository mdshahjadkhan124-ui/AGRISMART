const jwt = require('jsonwebtoken');
const env = require('../src/config/env');

// Forges a valid access token directly (same secret/shape the real
// login flow produces) so integration tests can hit RBAC-guarded routes
// without depending on the login flow itself succeeding first.
function makeToken(userId, role) {
  return jwt.sign({ sub: userId, role }, env.jwtAccessSecret, { expiresIn: '5m' });
}

function authHeader(userId, role) {
  return { Authorization: `Bearer ${makeToken(userId, role)}` };
}

module.exports = { makeToken, authHeader };
