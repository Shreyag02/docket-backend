const Joi = require("joi");

module.exports = {
  clientRegister: Joi.object({
    clientName: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `clientName should be a type of string`,
        "string.empty": `clientName must contain value`,
        "string.pattern.base": `invalid client name`,
        "any.required": `clientName is a required field`,
      }),
  }),
};
