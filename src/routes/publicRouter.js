const { Router } = require("express");
const userController = require("../controller/userController");

const publicRouter = Router();

publicRouter.post("/register", userController.createUser);
publicRouter.post("/login", userController.login);

module.exports = publicRouter;
