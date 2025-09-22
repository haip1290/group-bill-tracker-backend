const { Router } = require("express");
const userController = require("../controller/userController");
const authenticateJwt = require("../auth/authMiddleware");

const userRouter = Router();

userRouter.use(authenticateJwt);

userRouter.get("/dashboard", userController.getDashboard);
userRouter.get("/search", userController.searchUser);

module.exports = userRouter;
