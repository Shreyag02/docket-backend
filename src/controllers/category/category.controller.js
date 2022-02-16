const { Category, Task } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const { categoryRegister } = require("../../utilities/validations/category");
const {
  DataNotFoundError,
  DataDuplicateError,
} = require("../../utilities/views/errorResponse");

module.exports = {
  create: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await categoryRegister.validateAsync(req.body);

      let oauth = res.locals.oauth.token;
      let { categoryName } = value;

      const category = await Category.findOne({
        where: {
          name: categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (category) {
        throw new DataDuplicateError("Category exists with same name");
      }

      const payload = {
        id: uuidv4(),
        name: categoryName,
        userId: oauth.user.id,
      };

      Category.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  get: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;

      const categories = await Category.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
        attributes: { exclude: ["archivedAt", "createdAt", "updatedAt"] },
      });

      return successResponse(req, res, categories);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;

      const category = await Category.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!category) {
        throw new DataNotFoundError("Category not found");
      }

      await Category.update(
        {
          archivedAt: new Date().toUTCString(),
        },
        {
          where: {
            name: req.params.id,
            userId: oauth.user.id,
          },
        }
      );

      return successResponse(
        req,
        res,
        ` ${category.name} deleted successfully`
      );
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  getTasks: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;

      const category = await Category.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
        include: {
          model: Task,
          as: "tasks",
          reuired: false,
          where: {
            archivedAt: null,
          },
          attributes: { exclude: ["archivedAt", "createdAt", "updatedAt"] },
        },
      });

      if (!category) {
        throw new DataNotFoundError("Category not found");
      }

      return successResponse(req, res, category.tasks);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
