const { Router } = require("express");
const userController = require("../controller/userController");
const authenticateJwt = require("../auth/authMiddleware");

const userRouter = Router();

userRouter.get("/dashboard", authenticateJwt, userController.getDashboard);

module.exports = userRouter;
