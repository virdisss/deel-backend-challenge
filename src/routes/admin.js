const express = require("express");
const { findBestProfession, findBestClient } = require("../controllers/admin");
const adminRouter = express.Router();
const { check } = require("express-validator");
const ValidateRequest = require("../middleware/validateRequest");

adminRouter.get(
  "/best-profession",
  [
    check("start")
      .trim()
      .isISO8601()
      .toDate()
      .withMessage("A valid start date is Required"),
    check("end")
      .trim()
      .isISO8601()
      .toDate()
      .withMessage("A valid end date is required")
      .custom((value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.query.start);
        return endDate.getTime() > startDate.getTime();
      })
      .withMessage("End date must be greater than start date")
  ],
  ValidateRequest,
  findBestProfession
);

adminRouter.get(
  "/best-clients",
  [
    check("start")
      .trim()
      .isISO8601()
      .toDate()
      .withMessage("A valid start date is Required"),
    check("end")
      .trim()
      .isISO8601()
      .toDate()
      .withMessage("A valid end date is required")
      .custom((value, { req }) => {
        const endDate = new Date(value);
        const startDate = new Date(req.query.start);
        return endDate.getTime() > startDate.getTime();
      })
      .withMessage("End date must be greater than start date")
  ],
  ValidateRequest,
  findBestClient
);

module.exports = adminRouter;
