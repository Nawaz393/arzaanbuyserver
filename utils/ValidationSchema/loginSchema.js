const joi = require("joi");

const loginSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(5).required(),
});

module.exports = loginSchema;
