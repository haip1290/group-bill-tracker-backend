const validateActivityDtoToCreate = (req, res, next) => {
  next();
};
const validateActivityDtoToUpdate = (req, res, next) => {
  next();
};

const validateActivityStatus = (status) => {
  const validStatus = ["unpaid", "paid"];
  if (!validStatus.includes(status)) {
    return undefined;
  }
  return status;
};

module.exports = {
  validateActivityDtoToCreate,
  validateActivityDtoToUpdate,
  validateActivityStatus,
};
