const asyncHandler = require("express-async-handler");
const { activityToDto } = require("./mapper/mapper");
const activityRepository = require("../repository/activityRepository");
const validateActivityDto = require("../validators/activityValidator");

const activityController = {
  createActivity: [
    validateActivityDto,
    asyncHandler(async (req, res) => {
      console.log("Creating new activity");
      const { name, totalCost, date, userIds } = req.body;
      const participants = userIds.map((userId) => ({
        accountId: userId,
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
};

module.exports = activityController;
