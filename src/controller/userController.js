const asyncHandler = require("express-async-handler");
const userRepository = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userToDto } = require("./mapper/mapper");
const passport = require("../auth/passport");
const validateUserRegister = require("../validators/userValidator");

const userController = {
  createUser: [
    validateUserRegister,
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

  login: (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (!user) {
        const message = info ? info.message : "Invalid credentials";
        return res.status(400).json({ message });
      }
      const payload = { id: user.id };
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("JWT secret is not defined");
        const message = "Server configuration error";
        return res.status(500).json({ message });
      }

      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      const message = "Login successful";
      return res.json({
        message,
        data: { token: token, user: userToDto(user) },
      });
    })(req, res);
  },
  getDashboard: [
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      return res.json({ message: "Dashboard" });
    },
  ],
};

module.exports = userController;
