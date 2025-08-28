require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");

const app = express();

app.use(express.json());

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  return res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
