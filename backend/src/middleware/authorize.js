const ApiError = require('../utils/ApiError');

// Must run after `authenticate`. Restricts a route to a set of roles, e.g.
// router.get('/reports', authenticate, authorize(ROLES.OFFICER, ROLES.SUPER_ADMIN), handler)
const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }
  next();
};

module.exports = authorize;
