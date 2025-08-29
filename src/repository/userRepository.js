const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const userRepository = {
  createUser: async (user) => {
    try {
      const newUser = await prisma.user.create({
        data: user,
      });
      console.log("User created", newUser.id);
      return newUser;
    } catch (error) {
      console.error("Error inserting user into DB ", error);
      throw error;
    }
  },
};

module.exports = userRepository;
