const resourceExistErrorHandler = (err) => {
  if (err.code === "P2002") {
    console.error(err);
    const resource = err.meta.modelName;
    const field = err.meta.target;
    throw new Error(`${resource} with ${field} already exists`);
  }
};

module.exports = { resourceExistErrorHandler };
