const Joi = require("joi");

module.exports = {
  taskRegister: Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    categoryName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    addToMyDay: Joi.date(),
  }),

  taskStatusUpdate: Joi.object({
    status: Joi.string().valid("pending", "completed").required(),
  }),

  taskUpdate: Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    categoryName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    description: Joi.string().min(3).required(),

    priority: Joi.string().valid("urgent", "medium", "low").required(),

    dueDate: Joi.date(),

    reminderDate: Joi.date(),

    repeat: Joi.string()
      .valid("daily", "monthly", "weekly", "yearly")
      .required(),

    addToMyDay: Joi.date(),

    status: Joi.string().valid("pending", "completed").required(),

    tags: Joi.array().items(
      Joi.string()
        .min(3)
        .max(30)
        .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
    ),

    subtasks: Joi.array().items(
      Joi.object({
        id: Joi.string().allow(null, ""),
        name: Joi.string()
          .min(3)
          .max(30)
          .required()
          .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

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
