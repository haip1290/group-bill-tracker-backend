const { validationResult } = require("express-validator");

const validationResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ message: "Error", errors: errorMessages });
  }
  next();
};

module.exports = validationResultHandler;
