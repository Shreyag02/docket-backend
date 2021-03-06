const { Tag, Task } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const { tagRegister } = require("../../utilities/validations/tag");
const {
  DataDuplicateError,
  DataNotFoundError,
} = require("../../utilities/views/errorResponse");

module.exports = {
  create: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await tagRegister.validateAsync(req.body);

      let { tagName } = value;
      let oauth = res.locals.oauth.token;

      const tag = await Tag.findOne({
        where: {
          name: tagName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (tag) {
        throw new DataDuplicateError("Tag exist with same name");
      }

      const payload = {
        id: uuidv4(),
        name: tagName,
        userId: oauth.user.id,
      };

      Tag.create(payload);

      return successResponse(req, res, payload);
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

      const tag = await Tag.findOne({
        where: {
          name: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!tag) {
        throw new DataNotFoundError("Tag is not found");
      } else {
        await Tag.update(
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
      }

      return successResponse(req, res, `${tag.tagName} deleted successfully`);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  get: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;

      const tags = await Tag.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
        attributes: { exclude: ["archivedAt", "createdAt", "updatedAt"] },
      });

      return successResponse(req, res, tags);
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

      const tag = await Tag.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
        include: {
          model: Task,
          as: "tasks",
          required: false,
          where: {
            archivedAt: null,
          },
          attributes: { exclude: ["archivedAt", "createdAt", "updatedAt"] },
        },
      });

      if (!tag) {
        throw new DataNotFoundError("Tag not found");
      }

      return successResponse(req, res, tag.tasks);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
