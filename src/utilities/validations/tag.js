const Joi = require("joi");

module.exports = {
  tagRegister: Joi.object({
    tagName: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `tagName should be a type of string`,
        "string.empty": `tagName must contain value`,
        "string.pattern.base": `invalid tag name`,
        "any.required": `tagName is a required field`,
      }),
  }),
};
