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
        where: { id, deletedAt: null },
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
   * @description this function find all activities based on user ID and status (unpaid, achieved, etc...)
   * @param {number} userId
   * @param {string} status unpaid, achieved etc ...
   * @returns {object} activities and total count
   */
  getActivitiesByUserIdAndStatus: async (userId, status) => {
    console.log(`Query ${status} activities by user ID ${userId}`);
    try {
      let statusWhere = {};
      switch (status) {
        case "unpaid":
          statusWhere = { isFullyPaid: false };
          break;
        case "paid":
          statusWhere = { isFullyPaid: true };
          break;
        default:
          console.log(`${status} status is provided`);
      }
      const where = {
        participants: { some: { accountId: userId } },
        deletedAt: null,
        ...statusWhere,
      };
      const [activities, count] = await prisma.$transaction([
        prisma.activity.findMany({
          where,
          include: { participants: { include: { account: true } } },
        }),
        prisma.activity.count({ where }),
      ]);
      console.log(`Found ${count} ${status} activities by user ID ${userId}`);
      return { activities, count };
    } catch (error) {
      console.error("Error query activities by user ID and status ", error);
      resourceNotFoundErrorHandler(error);
      throw error;
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
      // update based on privided data
      await prisma.activity.update({
        data: {
          ...updatedData,
          participants: {
            update: participantsToUpdate,
            create: participantsToCreate,
            delete: participantsToDelete,
          },
        },
        where: { id },
      });
      // get updated activity with full details
      const updatedActivity = await prisma.activity.findUniqueOrThrow({
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
   * @description paid activity (set isFullyPaid) activity
   * @param {number} id of activity
   * @returns {object} paid activity
   */
  paidActivityById: async (id) => {
    console.log("Paid activity by id ", id);
    try {
      // define where clause to find activity
      const where = {
        id,
        isFullyPaid: false,
        deletedAt: null,
      };
      const result = await prisma.activity.updateMany({
        data: { isFullyPaid: true },
        where,
      });
      // if found activity
      if (result.count !== 0) {
        const paidActivity = await prisma.activity.findUniqueOrThrow({
          where: { id },
          include: { participants: { include: { account: true } } },
        });
        console.log("Successfully paid acitivity with id ", paidActivity.id);
        return paidActivity;
      }
      // throw error when activity not found (result.count === 0)
      const activity = await prisma.activity.findUnique({ where: { id } });
      if (!activity) {
        // handle not found case
        const notFoundError = new Error(`Activity with ID ${id} not found`);
        notFoundError.code = "P2025";
        notFoundError.meta = { modelName: "Activity" };
        throw notFoundError;
      } else {
        // handle conflict case
        const conflictError = new Error(`Activity is already fully paid`);
        conflictError.status = 409;
        throw conflictError;
      }
    } catch (error) {
      console.error("Error setting activity to paid by id ", error);
      resourceNotFoundErrorHandler(error);
      throw error;
    }
  },
  /**
   * @description this function soft-deleted (set deletedAt) activity
   * @param {number} id of actvity
   * @returns {object} soft-deleted activity
   */
  softDeleteActivityById: async (id) => {
    console.log("Soft-delete activity by id ", id);
    try {
      const where = { id, deletedAt: null };
      const updatedActivity = await prisma.activity.update({
        data: { deletedAt: new Date() },
        where,
        include: { participants: true },
      });
      console.log("Soft-deleted activity with id ", updatedActivity.id);
      return updatedActivity;
    } catch (error) {
      console.error("Error soft-deleting error by id ", error);
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
