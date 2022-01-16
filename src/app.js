const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models/model");
const contractRouter = require("./routes/contract");
const { getProfile } = require("./middleware/getProfile");
const jobRouter = require("./routes/job");
const balanceRouter = require("./routes/balance");
const adminRouter = require("./routes/admin");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

//Defining the application routes
app.use(getProfile);
app.use("/contracts", contractRouter);
app.use("/jobs", jobRouter);
app.use("/balances", balanceRouter);
app.use("/admin", adminRouter);

// Using middleware to send error response to the client
app.use((error, req, res, next) => {
  res.status(error.statusCode).send(error);
});
module.exports = app;
