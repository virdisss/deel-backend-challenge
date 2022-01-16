const { Job, Contract, Profile, sequelize } = require("../models/model");
const { Op } = require("sequelize");
const Mutex = require("async-mutex").Mutex;
const createError = require("http-errors");
const mutex = new Mutex();

const findUnpaidJobs = async (req, res, next) => {
  const profileId = req.profile.id;
  const unpaidJobs = await Job.findAll({
    attributes: { exclude: ["ContractId"] },
    include: {
      model: Contract,
      attributes: { exclude: ["id", "ContractId", "ClientId"] },
      where: {
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        status: "in_progress"
      }
    },
    where: {
      paid: {
        [Op.not]: true
      }
    }
  });
  res.send(unpaidJobs);
};

const payJob = async (req, res, next) => {
  const jobId = req.params.job_id;
  const clientId = req.profile.id;

  const release = await mutex.acquire();

  try {
    // verify if the job exists
    const job = await Job.findByPk(jobId, { include: { model: Contract } });

    if (!job) {
      return next(createError.BadRequest(`No Jobs found with id ${jobId}`));
    }

    // verify if the job is already paid off
    if (job.paid) {
      return next(createError.BadRequest("This job is already paid"));
    }

    const client = await Profile.findOne({
      where: { id: clientId, type: "client" }
    });

    if (!client) {
      return next(
        createError.BadRequest(`Unable to find client with id ${clientId}`)
      );
    }

    const {
      Contract: { ContractorId }
    } = job;

    const contractor = await Profile.findOne({
      where: { id: ContractorId, type: "contractor" }
    });

    if (client.balance >= job.price) {
      await sequelize.transaction(async (t) => {
        await client.update(
          { balance: client.balance - job.price },
          { transaction: t }
        );
        await contractor.update(
          { balance: contractor.balance + job.price },
          { transaction: t }
        );
        const paidJob = await job.update(
          { paid: true, paymentDate: Date.now() },
          { transaction: t }
        );
        res.send(paidJob);
      });
    } else {
      return next(
        createError.UnprocessableEntity(
          "Unable to process the payment due to insufficient balance"
        )
      );
    }
  } catch (err) {
    return next(
      createError.InternalServerError("Error on processing transaction")
    );
  } finally {
    release();
  }
};

module.exports = {
  findUnpaidJobs,
  payJob
};
