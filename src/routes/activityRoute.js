const { Router } = require("express");
const activityController = require("../controller/activityController");
const authenticateJwt = require("../auth/authMiddleware");

const activityRouter = Router();

activityRouter.use(authenticateJwt);

activityRouter.post("/", activityController.createActivity);
activityRouter.get("/", activityController.getActivitiesByUserID);
activityRouter.get("/:id", activityController.getActivityById);
activityRouter.put("/:id", activityController.updateActivity);

module.exports = activityRouter;
