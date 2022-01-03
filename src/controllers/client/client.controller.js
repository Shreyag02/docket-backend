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
        where: { clientName },
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
      return successResponse(req, res, client);
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  login: async (req, res) => {
    try {
      const client = await Client.findOne({
        where: { clientName },
      });
      if (!client) {
        return errorResponse(req, res, "Incorrect Client Name", 403);
      }

      if (req.body.clientSecret !== client.clientSecret) {
        return errorResponse(req, res, "Incorrect client secret", 403);
      }

      return successResponse(req, res, "your client id is" + client.clientId);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
