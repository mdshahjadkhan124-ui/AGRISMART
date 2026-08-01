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

module.exports = validate;
