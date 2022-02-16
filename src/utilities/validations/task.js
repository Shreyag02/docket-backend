const Joi = require("joi");

module.exports = {
  taskRegister: Joi.object({
    name: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `taskName should be a type of string`,
        "string.empty": `taskName must contain value`,
        "string.pattern.base": `invalid task name`,
        "any.required": `taskName is a required field`,
      }),

    categoryName: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `categoryName should be a type of string`,
        "string.empty": `categoryName must contain value`,
        "string.pattern.base": `invalid category name`,
        "any.required": `categoryName is a required field`,
      }),

    addToMyDay: Joi.date(),
  }),

  taskStatusUpdate: Joi.object({
    status: Joi.string().valid("pending", "completed").required(),
  }),

  taskUpdate: Joi.object({
    name: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `taskName should be a type of string`,
        "string.empty": `taskName must contain value`,
        "string.pattern.base": `invalid task name`,
        "any.required": `taskName is a required field`,
      }),

    categoryName: Joi.string()
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
      .messages({
        "string.base": `categoryName should be a type of string`,
        "string.empty": `categoryName must contain value`,
        "string.pattern.base": `invalid category name`,
        "any.required": `categoryName is a required field`,
      }),

    description: Joi.string().required().messages({
      "string.base": `description should be a type of string`,
      "string.empty": `description must contain value`,
      "string.pattern.base": `invalid description`,
      "any.required": `description is a required field`,
    }),

    priority: Joi.string().valid("urgent", "medium", "low").required(),

    dueDate: Joi.date(),

    reminderDate: Joi.date(),

    repeat: Joi.string()
      .valid("daily", "monthly", "weekly", "yearly")
      .required(),

    addToMyDay: Joi.date(),

    status: Joi.string().valid("pending", "completed").required(),

    tags: Joi.array().items(
      Joi.object({
        id: Joi.string().allow(null, ""),
        name: Joi.string()
          .required()
          .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
          .messages({
            "string.base": `tagName should be a type of string`,
            "string.empty": `tagName must contain value`,
            "string.pattern.base": `invalid tag name`,
            "any.required": `tagName is a required field`,
          }),
      })
    ),

    subtasks: Joi.array().items(
      Joi.object({
        id: Joi.string().allow(null, ""),
        name: Joi.string()
          .required()
          .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
          .messages({
            "string.base": `subtaskName should be a type of string`,
            "string.empty": `subtaskName must contain value`,
            "string.pattern.base": `invalid subtask name`,
            "any.required": `subtask name is a required field`,
          }),

        status: Joi.string().valid("pending", "completed").required(),

        startTime: Joi.string().regex(
          /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/
        ),

        endTime: Joi.string().regex(
          /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/
        ),
      })
    ),
  }),
};
