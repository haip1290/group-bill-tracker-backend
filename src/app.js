require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const publicRouter = require("./routes/publicRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRoute");
const activityRouter = require("./routes/activityRoute");
const participantRouter = require("./routes/participantRoute");

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/", publicRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/activities", activityRouter);
app.use("/participants", participantRouter);

app.use((err, req, res, next) => {
  const status =
    err.status && err.status >= 400 && err.status < 500 ? err.status : 500;
  if (err.status === 500) {
    console.error("Unhandled Server Error: ", err);
  }

  const responseBody = { message: err.message || "Internal Server Error" };
  if (err.details) {
    responseBody.details = err.details;
  }
  return res.status(status).json(responseBody);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
