const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const userRepository = {
  createUser: async (user) => {
    console.log("Inserting new user");
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
  getUserByEmail: async (email) => {
    console.log("Query user by email");
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      console.log("User found", user);
      return user;
    } catch (error) {
      console.error("Error querying user from DB ", error);
      throw error;
    }
  },
  getUserById: async (id) => {
    console.log("Query user by id");
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      console.log("User found", user);
      return user;
    } catch (error) {
      console.error("Error querying user from DB ", error);
      throw error;
    }
  },
};

module.exports = userRepository;
