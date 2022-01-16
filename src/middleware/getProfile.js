const createError = require("http-errors");
const { Profile } = require("../models/model");

const getProfile = async (req, res, next) => {
  const profileId = req.get("profile_id");

  const profile = await Profile.findOne({
    where: { id: profileId || 0 }
  });

  if (!profile) {
    return next(
      createError.NotFound(`Profile with id: ${profileId} not found`)
    );
  }
  req.profile = profile;
  next();
};
module.exports = { getProfile };
