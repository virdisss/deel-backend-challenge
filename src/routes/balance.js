const express = require("express");
const { body } = require("express-validator");
const { deposit } = require("../controllers/balance");
const ValidateRequest = require("../middleware/validateRequest");
const balanceRouter = express.Router();

balanceRouter.post(
  "/deposit/:userId",
  [body("amount").isNumeric().withMessage("amount should be a number")],
  ValidateRequest,
  deposit
);

module.exports = balanceRouter;
