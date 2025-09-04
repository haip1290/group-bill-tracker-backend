const { Router } = require("express");
const userController = require("../controller/userController");

const authRouter = Router();

authRouter.post("/refresh", userController.refresh);

module.exports = authRouter;
