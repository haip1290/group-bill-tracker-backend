const { PrismaClient } = require("../generated/prisma");
const { resourceNotFoundErrorHandler } = require("./prismaErrorHandler");
const prisma = new PrismaClient();

const participantRepository = {
  updateParticipantById: async (participantDto) => {
    const { id, ...data } = participantDto;
    console.log("Updating participant by id ", id);
    try {
      const updatedParticipant = await prisma.participant.update({
        data,
        where: { id },
      });
      console.log("Updated participant");
      return updatedParticipant;
    } catch (error) {
      const errMsg = "Error while updating participant by id ";
      console.error(errMsg, error);
      resourceNotFoundErrorHandler(error);
      throw error;
    }
  },
};

module.exports = participantRepository;
