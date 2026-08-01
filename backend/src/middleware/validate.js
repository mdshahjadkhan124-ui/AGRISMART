const ApiError = require('../utils/ApiError');

// Validates req.body against a Zod schema and replaces it with the parsed
// (and type-coerced/trimmed) result so controllers can trust their input.
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((issue) => issue.message);
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.body = result.data;
  next();
};

// Same idea, for query string params (e.g. ?lat=&lon=&page=). req.query is
// a getter-only property in Express (reassigning it silently no-ops), so
// the parsed result is stashed on req.validatedQuery instead.
const validateQuery = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const details = result.error.issues.map((issue) => issue.message);
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.validatedQuery = result.data;
  next();
};

module.exports = validate;
module.exports.validate = validate;
module.exports.validateQuery = validateQuery;
