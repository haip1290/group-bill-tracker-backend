const { Router } = require("express");
const userController = require("../controller/userController");
const userRouter = Router();

userRouter.get("/dashboard", userController.getDashboard);

module.exports = userRouter;
