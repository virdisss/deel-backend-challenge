const { Job, Contract, Profile } = require("../models/model");
const { Op } = require("sequelize");
const Mutex = require("async-mutex").Mutex;
const createError = require("http-errors");
const mutex = new Mutex();

const PERCENTAGE_REQUIRED = 0.25;

const calculateTotalToPay = async (clientId) => {
  const totalPay = await Job.findOne({
    attributes: {
      include: [[Job.sequelize.fn("sum", Job.sequelize.col("price")), "price"]]
    },
    include: {
      model: Contract,
      where: {
        ClientId: clientId
      }
    },
    where: {
      paid: { [Op.not]: true }
    }
  });

  return totalPay.price || 0;
};

const deposit = async (req, res, next) => {
  const { userId } = req.params;
  const { amount } = req.body;

  const client = await Profile.findOne({
    where: { id: userId, type: "client" }
  });

  if (!client) {
    return next(createError.NotFound(`Client with id: ${userId} is not found`));
  }

  const release = await mutex.acquire();

  try {
    const totalPay = await calculateTotalToPay(userId);

    if (amount > totalPay * PERCENTAGE_REQUIRED) {
      return next(
        createError.UnprocessableEntity(
          "Clients can't deposit more than 25% his total of jobs to pay"
        )
      );
    }
    const updatedClient = await client.update({
      balance: client.balance + amount
    });
    res.send(updatedClient);
  } catch (error) {
    return next(
      createError.InternalServerError("Error on calculating the total payment")
    );
  } finally {
    release();
  }
};

module.exports = {
  deposit
};
