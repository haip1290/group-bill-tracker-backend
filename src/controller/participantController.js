const asyncHandler = require("express-async-handler");
const participantRepository = require("../repository/participantRepository");
const activityRepository = require("../repository/activityRepository");
const { participantToDto } = require("./mapper/mapper");
const {
  validateParticipantDtoToUpdate,
} = require("../validators/participantValidator");

const isFullyPaid = (activity) => {
  const totalPaid = activity.participants.reduce(
    (sum, participant) => sum + Number(participant.amount),
    0
  );
  return totalPaid >= Number(activity.totalCost);
};

const participantController = {
  updateParticipant: [
    validateParticipantDtoToUpdate,
    asyncHandler(async (req, res) => {
      const id = req.params.id;
      console.log("Updating participant by id ", id);
      const data = { id: Number(id), ...req.body };
      try {
        const updatedParticipant =
          await participantRepository.updateParticipantById(data);
        const activityId = updatedParticipant.activityId;
        const activity = await activityRepository.getActivityById(activityId);
        const isActivityFullyPaid = isFullyPaid(activity);
        if (activity.isFullyPaid !== isActivityFullyPaid) {
          const activityDto = {
            id: activityId,
            isFullyPaid: isActivityFullyPaid,
          };
          const updatedActivity =
            await activityRepository.updateActivityById(activityDto);
        }

        return res.json({
          message: "Updated participant",
          data: { updatedParticipant: participantToDto(updatedParticipant) },
        });
      } catch (error) {
        console.error("Error updating participant ", error);
        throw error;
      }
    }),
  ],
};

module.exports = participantController;
