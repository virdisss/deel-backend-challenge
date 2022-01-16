const { validationResult } = require("express-validator");
const createError = require("http-errors");

const ValidateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError.BadRequest(errors));
  }
  next();
};

module.exports = ValidateRequest;
