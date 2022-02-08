const Joi = require("joi");

module.exports = {
  taskRegister: Joi.object({
    taskName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    categoryName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    addToMyDay: Joi.date().raw(),
  }),

  taskUpdate: Joi.object({
    taskName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    categoryName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    description: Joi.string()
      .min(3)
      .required()
      .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

    priority: Joi.string().alphanum().min(3).max(30).required(),

    dueDate: Joi.date().raw(),

    addToMyDay: Joi.date().raw(),

    status: Joi.string().alphanum().min(3).max(30).required(),

    tags: Joi.array().items(
      Joi.string()
        .min(3)
        .max(30)
        .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
    ),

    subtasks: Joi.array().items(
      Joi.object({
        subtaskName: Joi.string()
          .min(3)
          .max(30)
          .required()
          .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),

        status: Joi.string().alphanum().min(3).max(30).required(),
      })
    ),
  }),
};
