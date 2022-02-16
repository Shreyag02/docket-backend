const Joi = require("joi");

module.exports = {
  analyticsSuccess: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),

  analyticsHours: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    resolution: Joi.string().required(),
  }),
};
