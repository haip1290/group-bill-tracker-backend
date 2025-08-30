const passport = require("passport");
const UserRepository = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const { userToDto } = require("../controller/mapper/mapper");

const localCallback = async (email, password, done) => {
  console.log(`Authenticating user with email`);
  try {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "Incorrect email or password" });
    }
    const matchPassword = bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return done(null, false, { message: "Incorrect email or password" });
    }
    const safeUser = userToDto(user);
    return done(null, safeUser);
  } catch (error) {
    return done(error);
  }
};

const localOptions = {
  usernameField: "email",
  passwordField: "password",
};

const localStrategy = new LocalStrategy(localOptions, localCallback);

passport.use(localStrategy);

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET not defined");
}
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};
const jwtCallback = async (payload, done) => {
  console.log(`Authenticating user with JWT`);
  try {
    const user = await UserRepository.getUserById(payload.id);
    if (!user) {
      return done(null, false, { message: "Incorrect token" });
    }
    const safeUser = userToDto(user);
    return done(null, safeUser);
  } catch (error) {
    return done(error);
  }
};

const jwtStrategy = new JWTStrategy(jwtOptions, jwtCallback);

passport.use(jwtStrategy);

module.exports = passport;
