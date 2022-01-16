const express = require("express");
const {
  getContractsById,
  getAllContracts
} = require("../controllers/contract");

const contractRouter = express.Router();

contractRouter.get("", getAllContracts);
contractRouter.get("/:id", getContractsById);

module.exports = contractRouter;
