const { Client } = require("../../models");
const {
  successResponse,
  errorResponse,
  generateRandomId,
} = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const { clientRegister } = require("../../utilities/validations/client");
const {
  DataDuplicateError,
  DataNotFoundError,
} = require("../../utilities/views/errorResponse");

module.exports = {
  register: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await clientRegister.validateAsync(req.body);

      let { clientName } = value;

      const client = await Client.findOne({
        where: { clientName, archivedAt: null },
      });

      if (client) {
        throw new DataDuplicateError("Client exists with same name");
      }

      const payload = {
        clientId: generateRandomId(48),
        clientSecret: generateRandomId(48),
        clientName,
        grants: ["refresh_token", "password"],
      };

      Client.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  getClient: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await clientRegister.validateAsync(req.body);

      let { clientName } = value;

      const client = await Client.findOne({
        where: { clientName, archivedAt: null },
      });

      if (!client) {
        throw new DataNotFoundError("Client not found");
      }

      return successResponse(req, res, client);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await clientRegister.validateAsync(req.body);

      let { clientName } = value;

      const client = await Client.findOne({
        where: {
          clientName,
          archivedAt: null,
        },
      });

      if (!client) {
        throw new DataNotFoundError("Client not found");
      } else {
        await Client.update(
          {
            archivedAt: new Date().toUTCString(),
          },
          {
            where: {
              clientName,
            },
          }
        );
      }
      return successResponse(
        req,
        res,
        `client ${client.clientName} deleted successfully`
      );
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
