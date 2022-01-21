const { User } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const {
  successResponse,
  errorResponse,
  encryptData,
} = require("../../utilities/helper");

module.exports = {
  register: async (req, res) => {
    try {
      let { email, password, firstName, lastName } = req.body;

      password = encryptData(password);

      console.log(req.body);

      const user = await User.findOne({
        where: { email, archivedAt: null },
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

      return successResponse(req, res, payload);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { email: req.body.email, archivedAt: null },
      });

      if (!user) {
        return errorResponse(req, res, "Incorrect Email Id", 403);
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then(() => console.log("true"))
        .catch(() => errorResponse(req, res, "Incorrect Password", 403));

      return successResponse(req, res, user);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
          archivedAt: null,
        },
      });

      if (!user) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        await User.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              email: req.body.email,
            },
          }
        );
      }
      return successResponse(req, res, user);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
