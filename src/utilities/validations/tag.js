const Joi = require("joi");

module.exports = {
  tagRegister: Joi.object({
    tagName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
  }),
};
