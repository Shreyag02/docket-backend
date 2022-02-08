const { User } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const logger = require("../../services/loggerService");

const {
  successResponse,
  errorResponse,
  encryptData,
} = require("../../utilities/helper");

const {
  userRegister,
  userLoginDel,
} = require("../../utilities/validations/user");

const {
  DataDuplicateError,
  DataForbiddenError,
  DataNotFoundError,
} = require("../../utilities/views/errorResponse");

module.exports = {
  register: async (req, res) => {
    logger.info("user register route is accessed");
    try {
      const value = await userRegister.validateAsync(req.body);

      let { email, password, firstName, lastName } = value;

      password = encryptData(password);

      const user = await User.findOne({
        where: { email, archivedAt: null },
      });

      if (user) {
        throw new DataDuplicateError("User already exists with same email");
      }

      const payload = {
        id: uuidv4(),
        email,
        firstName,
        lastName,
        password,
      };

      User.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  login: async (req, res) => {
    try {
      const value = await userLoginDel.validateAsync(req.body);

      let { email, password } = value;

      const user = await User.findOne({
        where: { email, archivedAt: null },
      });

      if (!user) {
        throw new DataForbiddenError("Incorrect Email Id");
      }

      let flag = await bcrypt
        .compare(password, user.password)
        .then(async (result) => {
          return result;
        });

      if (!flag) {
        throw new DataForbiddenError("Incorrect Password");
      }

      return successResponse(req, res, user);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
    try {
      const value = await userLoginDel.validateAsync(req.body);

      let { password } = value;
      let oauth = res.locals.oauth.token;

      const user = await User.findOne({
        where: {
          id: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!user) {
        throw new DataNotFoundError("User not found");
      }
      let flag = await bcrypt
        .compare(password, user.password)
        .then(async (result) => {
          return result;
        });

      if (!flag) {
        throw new DataForbiddenError("Incorrect Password");
      }

      await User.update(
        {
          archivedAt: new Date(),
        },
        {
          where: {
            id: oauth.user.id,
          },
        }
      );

      return successResponse(
        req,
        res,
        `user ${user.email} deleted successfully`
      );
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
