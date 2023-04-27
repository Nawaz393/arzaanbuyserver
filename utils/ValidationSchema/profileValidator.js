const joi = require("joi");

const profileSchema = joi.object().keys({
  name: joi.string().min(3).required(),
  address: joi.string().min(4).max(40).required(),
  phone: joi.string().required(),
  bio: joi.string().min(15).required(),
});

module.exports = profileSchema;
