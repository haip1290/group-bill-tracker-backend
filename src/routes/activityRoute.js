const { Router } = require("express");
const activityController = require("../controller/activityController");
const authenticateJwt = require("../auth/authMiddleware");

const activityRouter = Router();

activityRouter.post("/", authenticateJwt, activityController.createActivity);

module.exports = activityRouter;
