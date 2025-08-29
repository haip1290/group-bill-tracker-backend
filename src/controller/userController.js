const asyncHandler = require("express-async-handler");
const userRepository = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const { userToDto } = require("./mapper/mapper");

const userController = {
  createUser: [
    asyncHandler(async (req, res) => {
      console.log("Creating new user");
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userRepository.createUser({
        email,
        password: hashedPassword,
      });
      return res.json({ message: "User created", data: userToDto(newUser) });
    }),
  ],
};

module.exports = userController;
