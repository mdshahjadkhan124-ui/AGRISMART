const ApiError = require('../utils/ApiError');
const tokenService = require('../services/token.service');

// Verifies the access token from the Authorization header and attaches a
// minimal `req.user` ({ id, role }) for downstream RBAC checks. Does not
// hit the database on every request — that's the whole point of a signed
// access token.
function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired access token'));
  }
}

module.exports = authenticate;
