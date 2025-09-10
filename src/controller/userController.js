const asyncHandler = require("express-async-handler");
const userRepository = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userToDto } = require("./mapper/mapper");
const passport = require("../auth/passport");
const validateUserRegister = require("../validators/userValidator");
const {
  generateToken,
  setRefreshTokenCookie,
  verifyToken,
} = require("../services/authService");

const userController = {
  /**
   * @description middleware chain to han dle user registration
   * validate incoming request body from frontend
   * create new user in database
   * @returns JSON response object
   */
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
  /**
   * @description this middleware handle user login
   * authenticate user
   * create access token and refresh token
   * input cookie in response header with refresh token
   * @param {object} req frontend request
   * @param {object} res response to frontend
   * @returns {object} response object withtoken and user info if success, or error message if failure
   */
  login: (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        const message = info ? info.message : "Invalid credentials";
        return res.status(400).json({ message });
      }
      const payload = { id: user.id };
      const { accessToken, refreshToken } = generateToken(payload);
      setRefreshTokenCookie(res, refreshToken);

      const message = "Login successful";
      return res.json({
        message,
        data: { accessToken, user: userToDto(user) },
      });
    })(req, res);
  },
  /**
   * @description function to get new access token
   * from refresh token in request's cookie
   * @returns {object} response with new access token and user info
   */
  refresh: asyncHandler(async (req, res) => {
    // check refresh token from cookie
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
      // verify token
      const decodedPayload = verifyToken(refreshToken, secret);
      const user = await userRepository.getUserById(decodedPayload.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid token or user not found" });
      }
      // create new access token then return
      const payload = { id: user.id };
      const {accessToken: newAccessToken} = generateToken(payload);
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

  getDashboard: async (req, res) => {
    const user = req.user;
    return res.json({
      message: "Dashboard",
      data: { user: userToDto(user) },
    });
  },

  /**
   * @description function logout user
   * by clearing refresh token in cookie header
   * @param {object} req
   * @param {object} res
   * @returns {object} response with message
   */
  logout: (req, res) => {
    res.clearCookie("jwt");
    return res.json({ message: "Logout successful" });
  },
};

module.exports = userController;
