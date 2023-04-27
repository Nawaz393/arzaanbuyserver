const joi = require("joi");

const registerSchema = joi.object().keys({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(5).required(),
  cpassword: joi.string().min(5).required(),
});


module.exports = registerSchema;
