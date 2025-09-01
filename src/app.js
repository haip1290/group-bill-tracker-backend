require("dotenv").config();
const express = require("express");
const cors = require("cors");

const publicRouter = require("./routes/publicRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", publicRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: "Error", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
