const asyncHandler = require("express-async-handler");
const userRepository = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userToDto } = require("./mapper/mapper");
const passport = require("../auth/passport");

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
  login: (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ message: info ? info.message : "Invalid credentials" });
      }
      const payload = { id: user.id };
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      return res.json({
        message: "Login successful",
        data: { token: token, user: userToDto(user) },
      });
    })(req, res);
  },
  getDashboard: (req, res) => {
    return res.json({ message: "Dashboard" });
  },
};

module.exports = userController;
