const { Client } = require("../../models");
const {
  successResponse,
  errorResponse,
  generateRandomId,
} = require("../../utilities/helper");

module.exports = {
  register: async (req, res) => {
    try {
      let { clientName } = req.body;

      const client = await Client.findOne({
        where: { clientName, archivedAt: null },
      });
      if (client) {
        return errorResponse(
          req,
          res,
          "Client already exists with same name",
          409
        );
      }

      const payload = {
        clientId: generateRandomId(48),
        clientSecret: generateRandomId(48),
        clientName,
        grants: ["refresh_token", "password"],
      };
      console.log(payload);

      Client.create(payload);
      return successResponse(req, res, payload);
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  getClient: async (req, res) => {
    try {
      const client = await Client.findOne({
        where: { clientName: req.body.clientName },
      });
      if (!client) {
        return errorResponse(req, res, "Incorrect Client Name", 403);
      }

      return successResponse(req, res, client);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const client = await Client.findOne({
        where: {
          clientName: req.body.clientName,
          archivedAt: null,
        },
      });

      if (!client) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        await Client.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              clientName: req.body.clientName,
            },
          }
        );
      }
      return successResponse(req, res, client);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
