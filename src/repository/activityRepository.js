const { PrismaClient } = require("../generated/prisma");
const { resourceNotFoundErrorHandler } = require("./prismaErrorHandler");

const prisma = new PrismaClient();

const activityRepository = {
  /**
   * @description this function create new activity
   * @param {object} activityDto contain activity info include name, date, total cost
   * @returns {Promise<object>} new created activity
   */
  createActivity: async (activityDto) => {
    console.log("Inserting new activity");
    try {
      const { participants, ...data } = activityDto;
      const activity = await prisma.activity.create({
        data: { ...data, participants: { create: participants } },
        include: { participants: { include: { account: true } } },
      });
      console.log("inserted activity with id ", activity.id);
      return activity;
    } catch (error) {
      const errMsg = "Error inserting new activity ";
      console.error(errMsg, error);
      throw new Error(errMsg);
    }
  },

  getActivityById: async (id) => {
    console.log("Query activity by Id ", id);
    try {
      const activity = await prisma.activity.findUniqueOrThrow({
        where: { id },
        include: { participants: { include: { account: true } } },
      });
      console.log("Found activity ", activity.id);
      return activity;
    } catch (error) {
      const errMsg = "Error while query activity by id ";
      console.error(errMsg, error);
      resourceNotFoundErrorHandler(error);
      throw new Error("Error querying activity by Id");
    }
  },

  /**
   * @description thsi function find all activity that user participated in
   * @param {number} userId id of user
   * @returns {Array} activities that user participated in
   */
  getActivitiesByUserId: async (userId) => {
    console.log("Query activities by user id ", userId);
    try {
      const [activities, count] = await prisma.$transaction([
        prisma.activity.findMany({
          where: { participants: { some: { accountId: userId } } },
          include: { participants: { include: { account: true } } },
        }),
        prisma.activity.count({
          where: { participants: { some: { accountId: userId } } },
        }),
      ]);
      console.log(`Queried ${count} activities by user id ${userId}`);
      return { activities, count };
    } catch (error) {
      const errMsg = "Error getting activities by user id ";
      console.error(errMsg, error);
      throw new Error(errMsg);
    }
  },

  /**
   * @description this function update activity with provided
   * data (name, data, totalCost and participants etc...)
   * @param {object} data
   * @returns {object} updated activity
   */
  updateActivityById: async (activityDto) => {
    console.log("Updating activity by id ", activityDto.id);
    const {
      id,
      participantsToUpdate,
      participantsToCreate,
      participantsToDelete,
      ...updatedData
    } = activityDto;
    try {
      const updatedActivity = await prisma.activity.update({
        data: {
          ...updatedData,
          participants: {
            update: participantsToUpdate,
            create: participantsToCreate,
            delete: participantsToDelete,
          },
        },
        where: { id },
        include: { participants: { include: { account: true } } },
      });
      console.log("updated activity with id ", updatedActivity.id);
      return updatedActivity;
    } catch (error) {
      const errMsg = "Error updating activity ";
      console.error(errMsg, error);
      resourceNotFoundErrorHandler(error);
      throw error;
    }
  },
  /**
   * @description this function perform transaction to delete participants of activity
   * then delete the activity itself
   * @param {number} id
   * @returns {object} deleted activity
   */
  deleteActivityById: async (id) => {
    console.log("Deleting activity by id");
    try {
      const transactionResult = await prisma.$transaction([
        prisma.participant.deleteMany({ where: { activityId: id } }),
        prisma.activity.delete({ where: { id } }),
      ]);
      const deletedActivity = transactionResult[1];
      console.log("Deleted activity with id ", deletedActivity.id);
      return deletedActivity;
    } catch (error) {
      const errMsg = "Error deleting activity by id ";
      console.error(errMsg, error);
      resourceNotFoundErrorHandler(error);
      throw error;
    }
  },
};

module.exports = activityRepository;
