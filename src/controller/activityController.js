const asyncHandler = require("express-async-handler");
const { activityToDto } = require("./mapper/mapper");
const activityRepository = require("../repository/activityRepository");
const {
  validateActivityDtoToCreate,
  validateActivityDtoToUpdate,
} = require("../validators/activityValidator");

const activityController = {
  createActivity: [
    validateActivityDtoToCreate,
    asyncHandler(async (req, res) => {
      console.log("Creating new activity");
      const { name, totalCost, date, users } = req.body;
      const participants = users.map((participant) => ({
        accountId: participant.userId,
        amount: participant.amount,
      }));
      const newActivity = await activityRepository.createActivity({
        name,
        totalCost,
        date,
        participants,
      });
      console.log("Created actvity ", newActivity.id);
      return res.json({
        message: "Activity created",
        data: activityToDto(newActivity),
      });
    }),
  ],

  getActivities: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("Fetching activities by user Id ", userId);
    const { activities, count } =
      await activityRepository.getActivitiesByUserId(userId);
    const activitiesDto = activities.map(activityToDto);
    console.log(`Successfully fetched ${count} activities`);
    return res.json({
      message: "Fetch activities successfully",
      data: { activities: activitiesDto, count },
    });
  }),

  updateActivity: [
    validateActivityDtoToUpdate,
    asyncHandler(async (req, res) => {
      console.log("Updating activity");
      const id = parseInt(req.params.id);
      const { oldParticipants, newParticipants, name, totalCost, date } =
        req.body;
      const participantsToUpdate = oldParticipants.map((participant) => ({
        where: { id: participant.id },
        data: { amount: participant.amount },
      }));
      const participantsToCreate = newParticipants.map((participant) => ({
        accountId: participant.userId,
        amount: participant.amount,
      }));
      const activityDto = {
        id,
        name,
        totalCost,
        date,
        participantsToUpdate,
        participantsToCreate,
      };
      const updatedActivity =
        await activityRepository.updateActivityById(activityDto);
      console.log("Updated activity ", updatedActivity.id);
      return res.json({
        message: "Updated activity",
        data: activityToDto(updatedActivity),
      });
    }),
  ],
};

module.exports = activityController;
