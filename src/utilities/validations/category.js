const Joi = require("joi");

module.exports = {
  categoryRegister: Joi.object({
    categoryName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
  }),
};
