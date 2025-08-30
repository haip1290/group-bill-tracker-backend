const { Router } = require("express");
const indexRouter = Router();

const indexController = require("../controller/indexController.js");
const userController = require("../controller/userController");

indexRouter.get("/", indexController.index);
indexRouter.post("/register", userController.createUser);
indexRouter.post("/login", userController.login);

module.exports = indexRouter;
