const { User } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const {
  successResponse,
  errorResponse,
  encryptData,
} = require("../../utilities/helper");

module.exports = {
  register: async (req, res) => {
    try {
      let { email, password, firstName, lastName } = req.body;
      console.log(req.body);
      password = encryptData(password);

      console.log(User);
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
        id: uuidv4(),
        email,
        firstName,
        lastName,
        password,
      };
      console.log(payload);

      User.create(payload);
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
      const reqPass = encryptData(req.body.password);

      if (reqPass !== user.password) {
        return errorResponse(req, res, "Incorrect Password", 403);
      }

      return successResponse(req, res, user);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
