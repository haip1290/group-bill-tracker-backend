const asyncHandler = require("express-async-handler");
const { activityToDto } = require("./mapper/mapper");
const activityRepository = require("../repository/activityRepository");
const {
  validateActivityDtoToCreate,
  validateActivityDtoToUpdate,
} = require("../validators/activityValidator");

const findParticipantsToUpdate = (currentParticipants, updatedParticipants) => {
  const currentParticipantsMap = new Map(
    currentParticipants.map((p) => [p.accountId, p])
  );
  return updatedParticipants
    .filter(
      (p) =>
        currentParticipantsMap.has(p.accountId) &&
        currentParticipantsMap.get(p.accountId).amount !== p.amount
    )
    .map((p) => ({
      where: { id: currentParticipantsMap.get(p.accountId).id },
      data: { amount: p.amount },
    }));
};

const findParticipantsToCreate = (updatedParticipants) => {
  return updatedParticipants
    .filter((p) => !p.id)
    .map((p) => ({
      accountId: p.accountId,
      amount: p.amount,
    }));
};

const findParticipantToDelete = (currentParticipants, updatedParticipants) => {
  const updatedIdsSet = new Set(updatedParticipants.map((p) => p.id));
  return currentParticipants
    .filter((p) => !updatedIdsSet.has(p.id))
    .map((p) => ({
      id: p.id,
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

  getActivitiesByUserId: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const status = req.query.status;
    const statusLog = status ? `${status}` : "";
    console.log(`Getting ${statusLog} activities by user Id ${userId}`);
    const { activities, count } =
      await activityRepository.getActivitiesByUserIdAndStatus(userId, status);
    const activitiesDto = activities.map(activityToDto);
    console.log(
      `Successfully found ${count} ${statusLog} activities by user ID ${userId}`
    );
    return res.json({
      message: "Fetched activities successfully",
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

  updateActivityById: [
    validateActivityDtoToUpdate,
    asyncHandler(async (req, res) => {
      const activityId = parseInt(req.params.id);
      console.log(`Updating activity by ID ${activityId}`);
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
      console.log("Updated activity by ID ", updatedActivity.id);
      return res.json({
        message: "Updated activity",
        data: activityToDto(updatedActivity),
      });
    }),
  ],

  paidActivityById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Paid activity by ID ${id}`);
    const paidActivity = await activityRepository.paidActivityById(id);
    console.log(`Paid activity by ID ${paidActivity.id}`);

    return res.json({
      message: `paid activity by ID ${paidActivity.id}`,
      data: { activity: activityToDto(paidActivity) },
    });
  }),
};

module.exports = activityController;
