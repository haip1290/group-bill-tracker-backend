const { Router } = require("express");
const activityController = require("../controller/activityController");
const authenticateJwt = require("../auth/authMiddleware");

const activityRouter = Router();

activityRouter.use(authenticateJwt);

activityRouter.post("/", activityController.createActivity);
activityRouter.get("/", activityController.getActivitiesByUserId);
activityRouter.get("/:id", activityController.getActivityById);
activityRouter.put("/:id", activityController.updateActivityById);
activityRouter.put("/:id/paid", activityController.paidActivityById);

module.exports = activityRouter;
