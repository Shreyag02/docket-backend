const { User } = require("../../models");
const { genSaltSync, hashSync } = require("bcrypt");

const successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    success: true,
  });

const errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) =>
  res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

const salt = genSaltSync(5);

module.exports = {
  register: async (req, res) => {
    try {
      let { email, password, firstName, lastName } = req.body;
      console.log(req.body);
      password = hashSync(password, salt);

      const user = await User.findOne({
        where: { email },
      });
      if (user) {
        return errorResponse(
          req,
          res,
          "User already exists with same email",
          409
        );
      }

      const payload = {
        email,
        firstName,
        lastName,
        password,
      };
      console.log(payload);

      await User.create(payload);
      return successResponse(req, res, {});
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return errorResponse(req, res, "Incorrect Email Id", 403);
      }
      const reqPass = hashSync(req.body.password, salt);

      if (reqPass !== user.password) {
        return errorResponse(req, res, "Incorrect Password", 403);
      }

      return successResponse(req, res, user.firstName + user.lastName);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
