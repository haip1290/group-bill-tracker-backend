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
      console.error("Error while updating participant by id ", error);
      resourceNotFoundErrorHandler(error);
      throw error;
    }
  },
};

module.exports = participantRepository;
