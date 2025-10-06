const asyncHandler = require("express-async-handler");
const { activityToDto } = require("./mapper/mapper");
const activityRepository = require("../repository/activityRepository");
const {
  validateActivityDtoToCreate,
  validateActivityDtoToUpdate,
} = require("../validators/activityValidator");

const findParticipantsToUpdate = (currentParticipants, updatedParticipants) => {
  const currentIdsSet = new Set(
    currentParticipants.map((participant) => participant.accountId)
  );
  return updatedParticipants
    .filter((participant) => currentIdsSet.has(participant.accountId))
    .map((participant) => ({
      where: { id: participant.id },
      data: { amount: participant.amount },
    }));
};

const findParticipantsToCreate = (updatedParticipants) => {
  return updatedParticipants
    .filter((participant) => !participant.id)
    .map((participant) => ({
      accountId: participant.accountId,
      amount: participant.amount,
    }));
};

const findParticipantToDelete = (currentParticipants, updatedParticipants) => {
  const updatedIdsSet = new Set(
    updatedParticipants.map((participant) => participant.id)
  );
  return currentParticipants
    .filter((participant) => !updatedIdsSet.has(participant.id))
    .map((participant) => ({
      id: participant.id,
    }));
};

const activityController = {
  createActivity: [
    validateActivityDtoToCreate,
    asyncHandler(async (req, res) => {
      console.log("Creating new activity");
      console.log("body ", req.body);
      const { name, totalCost, date, users } = req.body;
      const activityDate = new Date(date);
      const participants = users.map((participant) => ({
        accountId: participant.accountId,
        amount: participant.amount,
      }));
      const newActivity = await activityRepository.createActivity({
        name,
        totalCost,
        date: activityDate,
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
    console.log("Getting activities by user Id ", userId);
    const { activities, count } =
      await activityRepository.getActivitiesByUserId(userId);
    const activitiesDto = activities.map(activityToDto);
    console.log(`Successfully fetched ${count} activities`);
    return res.json({
      message: "Fetch activities successfully",
      data: { activities: activitiesDto, count },
    });
  }),

  getActivityById: asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    console.log("Getting activity by id ", id);
    const activity = await activityRepository.getActivityById(id);
    console.log(`Found activity by id ${activity.id}`);
    return res.json({
      message: `Found activity by id ${activity.id}`,
      data: activityToDto(activity),
    });
  }),

  updateActivity: [
    validateActivityDtoToUpdate,
    asyncHandler(async (req, res) => {
      console.log("Updating activity");
      const activityId = parseInt(req.params.id);
      const {
        participants: updatedParticipants,
        name,
        totalCost,
        date,
      } = req.body;
      // get current activity data
      const activity = await activityRepository.getActivityById(activityId);
      const currentParticipants = activity.participants;
      // find common participants between current and frontend provided participants list to update
      const participantsToUpdate = findParticipantsToUpdate(
        currentParticipants,
        updatedParticipants
      );
      // find new participants that are not in current participants list
      const participantsToCreate =
        findParticipantsToCreate(updatedParticipants);
      // find removed participants that are no longer in current list
      const participantsToDelete = findParticipantToDelete(
        currentParticipants,
        updatedParticipants
      );
      console.log("to update ", participantsToUpdate);
      console.log("to create ", participantsToCreate);
      console.log("to delete ", participantsToDelete);
      const activityDto = {
        id: activityId,
        name,
        totalCost,
        date: new Date(date),
        participantsToUpdate,
        participantsToCreate,
        participantsToDelete,
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
