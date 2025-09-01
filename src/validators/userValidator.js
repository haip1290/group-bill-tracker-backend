const { body } = require("express-validator");
const validationResultHandler = require("./commonValidator");
const {
  commonErrorMessages,
  emailErrorMessages,
  passwordErrorMessages,
} = require("./errorMessages");

const validateUserRegister = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${commonErrorMessages.isRequired}`)
    .isEmail()
    .normalizeEmail()
    .withMessage(emailErrorMessages.isEmail),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${commonErrorMessages.isRequired}`)
    .isLength({ min: 6, max: 20 })
    .withMessage(passwordErrorMessages.minLength)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
    )
    .withMessage(passwordErrorMessages.isPassword),
  validationResultHandler,
];

module.exports = validateUserRegister;
