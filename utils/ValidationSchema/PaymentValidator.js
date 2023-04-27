const joi = require("joi");

const schema = joi.object().keys({
  name: joi.string().min(3).required(),
  description: joi.string().min(3).required(),
  quantity: joi.number().min(1).required(),
  price: joi.string().min(1).required(),
  currency: joi.string().min(1).required(),
  sku: joi.string().min(1).optional(),
});

module.exports = schema;
