const joi = require("joi");

const adSchema = joi.object().keys({
  userid: joi.string().required(),
  name: joi.string().min(3).required(),
  tagline: joi.string().min(3).required(),
  description: joi.string().min(20).max(300).required(),
  detail: joi.string().min(20).max(300).required(),
  price: joi.string().min(3).required(),
  category: joi.string().required(),
  email: joi.string().email().required(),
  whatsapp: joi.number().min(5).required(),
  phone: joi.number().min(5).required(),
  address: joi.string().min(5).required(),
  website: joi.string().min(5).required(),
  
});

module.exports = adSchema;
