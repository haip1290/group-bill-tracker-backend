const { PrismaClient } = require("../generated/prisma");
const { resourceExistErrorHandler } = require("./prismaErrorHandler");
const prisma = new PrismaClient();

const userRepository = {
  createUser: async (userDto) => {
    console.log("Inserting new user");
    try {
      const newUser = await prisma.user.create({
        data: userDto,
      });
      console.log("User created", newUser.id);
      return newUser;
    } catch (error) {
      const errMsg = "Error inserting user into DB ";
      console.error(errMsg, error);
      resourceExistErrorHandler(error);
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
      const errMsg = "Error querying user from DB ";
      console.error(errMsg, error);
      throw error;
    }
  },
  getUsersByEmailSearch: async (searchWord) => {
    console.log("Query for user by email contain ", searchWord);
    try {
      const users = await prisma.user.findMany({
        where: { email: { contains: searchWord } },
        take: 10,
      });
      console.log("Found users with email contain search word");
      return users;
    } catch (error) {
      const errMsg = "Error querying for user by email contain search word";
      console.error(errMsg, error);
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
      const errMsg = "Error querying user from DB ";
      console.error(errMsg, error);
      throw error;
    }
  },
};

module.exports = userRepository;
