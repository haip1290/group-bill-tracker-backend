const { Router } = require("express");
const indexRouter = Router();

const indexController = require("../controller/indexController.js");

indexRouter.get("/", indexController.index);

module.exports = indexRouter;
