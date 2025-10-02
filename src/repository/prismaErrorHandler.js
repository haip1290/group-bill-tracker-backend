const resourceExistErrorHandler = (err) => {
  if (err.code === "P2002") {
    const { modelName, target } = err.meta;
    const fieldName = target[0];
    const message = `Resource already exists`;
    const error = new Error(message);
    error.status = 409;
    error.details = {
      model: modelName,
      field: fieldName,
      code: err.code,
    };
    throw error;
  }
};

const resourceNotFoundErrorHandler = (err) => {
  if (err.code === "P2025") {
    const { modelName, field } = err.meta;
    const error = new Error(err.message || "Resource Not Found");
    error.status = 404;
    error.details = { model: modelName, field: field, code: err.code };
    throw error;
  }
};

module.exports = { resourceExistErrorHandler, resourceNotFoundErrorHandler };
