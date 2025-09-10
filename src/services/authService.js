const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not define in environments variables");
}

/**
 * @description Generates access token and a refresh token for a user
 * @param {object} payload - The payload to create token
 * @returns {object} access and refresh tokens
 */
const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

/**
 * @description Sets an HTTP-only cookie with the refresh token.
 * @param {object} res response object.
 * @param {string} refreshToken - refresh token to set in the cookie.
 */

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 6 * 6 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, setRefreshTokenCookie, verifyToken };
