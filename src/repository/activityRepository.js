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
   * @description thsi function find all non-delete and unpaid activity that user participated in
   * @param {number} userId id of user
   * @returns {object} list of activities and total count that user participated in
   */
  getUnpaidActivitiesByUserId: async (userId) => {
    console.log("Query unpaid, non-deleted activities by user id ", userId);
    try {
      // where clause to find activity
      const where = {
        participants: { some: { accountId: userId } },
        isFullyPaid: false,
        deletedAt: null,
      };
      const [activities, count] = await prisma.$transaction([
        prisma.activity.findMany({
          where,
          include: { participants: { include: { account: true } } },
        }),
        prisma.activity.count({ where }),
      ]);
      console.log(
        `Queried unpaid, non-deleted ${count} activities by user id ${userId}`
      );
      return { activities, count };
    } catch (error) {
      const errMsg = "Error getting unpaid activities by user id ";
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
      // get updated activity after update
      const updatedActivity = await prisma.activity.findUniqueOrThrow({
        where: { id },
        include: { participants: true },
      });
      console.log("updated activity with id ", updatedActivity.id);
      // then check if activity is fully paid
      const totalPaidAmount = updatedActivity.participants.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const isFullyPaid =
        totalPaidAmount.toFixed(2) === updatedActivity.totalCost.toFixed(2);
      // change isFullyPaid status accordingly
      const updatedStatusAcitivity = await prisma.activity.update({
        data: { isFullyPaid },
        where: { id },
        include: { participants: { include: { account: true } } },
      });
      return updatedStatusAcitivity;
    } catch (error) {
      const errMsg = "Error updating activity ";
      console.error(errMsg, error);
      resourceNotFoundErrorHandler(error);
      throw error;
    }
  },

  /**
   * @description achieves activity (set isAchieved) activity
   * @param {number} id of activity
   * @returns {object} achieved activity
   */
  achieveActivityById: async (id) => {
    console.log("Achieve activity by id ", id);
    try {
      // define where clause
      const where = {
        id,
        isFullyPaid: true,
        achievedAt: null,
        deletedAt: null,
      };
      const achievedActivity = await prisma.activity.update({
        data: { achievedAt: new Date() },
        where,
        include: { participants: true },
      });
      console.log(
        "Successfully achieved acitivity with id ",
        achievedActivity.id
      );
      return achievedActivity;
    } catch (error) {
      console.error("Error achieve activity by id ", error);
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
