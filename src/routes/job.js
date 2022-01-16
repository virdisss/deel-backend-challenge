const express = require("express");
const { findUnpaidJobs, payJob } = require("../controllers/job");

const jobRouter = express.Router();

jobRouter.get("/unpaid", findUnpaidJobs);
jobRouter.post("/:job_id/pay", payJob);
module.exports = jobRouter;
