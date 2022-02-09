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

    addToMyDay: Joi.date(),
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

    description: Joi.string().min(3).required(),
    priority: Joi.string().alphanum().min(3).max(30).required(),

    dueDate: Joi.date(),

    addToMyDay: Joi.date(),

    status: Joi.string().alphanum().min(3).max(30).required(),

    tags: Joi.array().items(
      Joi.object({
        id: Joi.string().uuid().allow(null, ""),
        tagName: Joi.string()
          .min(3)
          .max(30)
          .required()
          .regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
      })
    ),

    subtasks: Joi.array().items(
      Joi.object({
        id: Joi.string().uuid().allow(null, ""),
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
