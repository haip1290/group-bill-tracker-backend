const commonErrorMessages = {
  isRequired: "is required",
};

const emailErrorMessages = {
  isEmail: "Please enter a valid email",
};

const passwordErrorMessages = {
  isPassword:
    "Please enter a valid password.Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character",
  minLength: "Password must be between 8 to 20 characters long",
};

module.exports = {
  commonErrorMessages,
  emailErrorMessages,
  passwordErrorMessages,
};
