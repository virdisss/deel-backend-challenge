const createError = require("http-errors");
const { Op } = require("sequelize");
const { Job, Contract, Profile } = require("../models/model");
const DEFAULT_LIMIT = 2;

const findBestProfession = async (req, res, next) => {
  const { start, end } = req.query;
  const profession = await Job.findOne({
    attributes: {
      include: [
        "Contract->Contractor.profession",
        [Job.sequelize.fn("sum", Job.sequelize.col("price")), "price"]
      ]
    },
    include: {
      model: Contract,
      attributes: { exclude: ["ContractorId", "ClientId"] },
      include: {
        model: Profile,
        as: "Contractor",
        where: {
          type: "contractor"
        }
      }
    },
    where: {
      paid: true,
      paymentDate: { [Op.between]: [start, end] }
    },
    group: ["profession"],
    order: [[Job.sequelize.fn("sum", Job.sequelize.col("price")), "DESC"]]
  });
  if (!profession) {
    return next(
      createError.NotFound("No best profession found int the query time range")
    );
  }
  const result = {
    name: profession.Contract.Contractor.profession,
    price: profession.price
  };
  res.send(result);
};

const findBestClient = async (req, res, next) => {
  const { start, end, limit } = req.query;
  const clients = await Job.findAll({
    attributes: {
      include: [
        "Contract->Client.id",
        [Job.sequelize.fn("sum", Job.sequelize.col("price")), "price"]
      ]
    },
    include: {
      model: Contract,
      attributes: { exclude: ["ContractorId", "ClientId"] },
      include: { model: Profile, as: "Client" }
    },
    where: {
      paid: true,
      paymentDate: { [Op.between]: [start, end] }
    },
    group: ["Contract->Client.id"],
    order: [[Job.sequelize.fn("sum", Job.sequelize.col("price")), "DESC"]],
    limit: limit || DEFAULT_LIMIT
  });

  if (clients && !clients.length) {
    return next(
      createError.NotFound("No best client found int the query time range")
    );
  }

  const result = clients.map((client) => {
    return {
      id: client.Contract.Client.id,
      fullName: `${client.Contract.Client.firstName} ${client.Contract.Client.lastName}`,
      paid: client.price
    };
  });
  res.send(result);
};

module.exports = {
  findBestClient,
  findBestProfession
};
