const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

const usersRoute = require("./routes/users");
const loginRoute = require("./routes/login");

app.use(express.json());
app.use("/", usersRoute);
app.use("/", loginRoute);

const PORT = 8001;
app.listen(PORT, async () => {
  console.log("Server running on port 8001");
  try {
    await sequelize.authenticate();
    console.log("database connection has been established");
  } catch (err) {
    console.log("error in authentication");
  }
});
