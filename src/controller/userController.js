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

      const accessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
      const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      });
      const message = "Login successful";
      return res.json({
        message,
        data: { accessToken, user: userToDto(user) },
      });
    })(req, res);
  },
  refresh: asyncHandler(async (req, res) => {
    // check refresh token from cookie
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    // check secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT secret is not define");
      res.status(500).json("Server configuration error");
    }

    try {
      // verify token
      const decodedPayload = jwt.verify(refreshToken, secret);
      const user = await userRepository.getUserById(decodedPayload.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid token or user not found" });
      }
      // create new access token then return
      const payload = { id: user.id };
      const newAccessToken = jwt.sign(payload, secret, { expiresIn: "1h" });
      return res.json({
        message: "New access token generated",
        data: { accessToken: newAccessToken, user: userToDto(user) },
      });
    } catch (error) {
      console.error("Token refresh failed ", error);
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login again" });
    }
  }),
  getDashboard: [
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      const id = req.user.id;
      const user = await userRepository.getUserById(id);
      return res.json({
        message: "Dashboard",
        data: { user: userToDto(user) },
      });
    },
  ],
};

module.exports = userController;
