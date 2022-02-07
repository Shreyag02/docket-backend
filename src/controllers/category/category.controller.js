const { Category, Task } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

const { categoryRegister } = require("../../utilities/validations/category");
const {
  dataNotFoundError,
  dataDuplicateError,
} = require("../../utilities/views/errorResponse");
const loggerService = require("../../services/loggerService");

module.exports = {
  create: async (req, res) => {
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
        throw new dataDuplicateError("Category exists with same name");
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
    try {
      let oauth = res.locals.oauth.token;

      const categories = await Category.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      return successResponse(req, res, categories);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
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
        throw new dataNotFoundError("Category not found");
      }

      await Category.update(
        {
          archivedAt: new Date(),
        },
        {
          where: {
            name: req.params.id,
            userId: oauth.user.id,
          },
        }
      );

      return successResponse(req, res, category);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  getTasks: async (req, res) => {
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
        },
      });

      if (!category) {
        throw new dataNotFoundError("Category not found");
      }

      return successResponse(req, res, category.tasks);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
