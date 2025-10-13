const validateActivityDtoToCreate = (req, res, next) => {
  next();
};
const validateActivityDtoToUpdate = (req, res, next) => {
  next();
};

const validateActivityStatus = (status) => {
  const validStatus = ["unpaid", "achieved"];
  if (!validStatus.includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing activity status query parameter." });
  }
};

module.exports = {
  validateActivityDtoToCreate,
  validateActivityDtoToUpdate,
  validateActivityStatus,
};
