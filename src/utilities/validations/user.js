const Joi = require("joi");

module.exports = {
  userRegister: Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).required(),

    lastName: Joi.string().alphanum().min(3).max(30).required(),

    //atleast 1 number [0-9]
    //atleast 1 capital alphabet [A-Z]
    //atleast 1 special character [!@#$%^&*]
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$"
        )
      )
      .required()
      .error(new Error("password is not valid")),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .error(new Error("email is not valid"))
      .required(),
  }),

  userLoginDel: Joi.object({
    //atleast 1 number [0-9]
    //atleast 1 capital alphabet [A-Z]
    //atleast 1 special character [!@#$%^&*]
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$"
        )
      )
      .required()
      .error(new Error("password is not valid")),
  }),
};
