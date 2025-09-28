const { Router } = require("express");
const participantController = require("../controller/participantController");
const authenticateJwt = require("../auth/authMiddleware");

const participantRouter = Router();

participantRouter.use(authenticateJwt);

participantRouter.put("/:id", participantController.updateParticipant);

module.exports = participantRouter;
