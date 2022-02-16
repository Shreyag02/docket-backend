const Joi = require("joi");

module.exports = {
  categoryRegister: Joi.object({
    categoryName: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `categoryName should be a type of string`,
        "string.empty": `categoryName must contain value`,
        "string.pattern.base": `invalid category name`,
        "any.required": `categoryName is a required field`,
      }),
  }),
};
