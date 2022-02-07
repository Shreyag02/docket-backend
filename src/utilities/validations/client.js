const Joi = require("joi");

module.exports = {
  clientRegister: Joi.object({
    clientName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
  }),
};
