const resourceExistErrorHandler = (err) => {
  if (err.code === "P2002") {
    const { modelName, field } = err.meta;
    throw new Error(`${modelName} with ${field} already exists`);
  }
};

const resourceNotFoundErrorHandler = (err) => {
  if (err.code === "P2025") {
    const { modelName, field } = err.meta;
    throw new Error(`${modelName} with ${field} not found`);
  }
};

module.exports = { resourceExistErrorHandler, resourceNotFoundErrorHandler };
