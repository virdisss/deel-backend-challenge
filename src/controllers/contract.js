const { Contract } = require("../models/model");
const { Op } = require("sequelize");
const createError = require("http-errors");

const getContractsById = async (req, res, next) => {
  const { id } = req.params;
  const profileId = req.profile.id;
  const contract = await Contract.findOne({
    attributes: { exclude: ["ContractorId", "ClientId"] },
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
    }
  });
  if (!contract) {
    return next(
      createError.NotFound(
        `No contracts found with id: ${id} under profileId: ${profileId}`
      )
    );
  }
  res.send(contract);
};

const getAllContracts = async (req, res, next) => {
  const profileId = req.profile.id;
  const allContracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: {
        [Op.not]: "terminated"
      }
    }
  });
  res.send(allContracts);
};

module.exports = {
  getContractsById,
  getAllContracts
};
