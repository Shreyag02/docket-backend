const { Client, User, Token } = require("../../models");
const bcrypt = require("bcrypt");

const {
  DataForbiddenError,
  DataNotFoundError,
} = require("../../utilities/views/errorResponse");

const logger = require("../../services/loggerService");

const VALID_SCOPES = ["read", "write"];

module.exports = {
  getClient: async (clientId, clientSecret) => {
    logger.info("getClient route is accessed");

    try {
      const client = await Client.findOne({
        where: {
          clientId,
          archivedAt: null,
        },
      });

      if (!client) {
        throw new DataNotFoundError("Client not found");
      }

      if (client.clientSecret !== clientSecret) {
        throw new DataForbiddenError("Client secret is incorrect");
      }

      return {
        id: client.clientId,
        redirectUris: client.dataUris,
        grants: client.grants,
      };
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },

  getUser: async (username, password) => {
    logger.info("get user route is accessed");

    try {
      const user = await User.findOne({
        where: {
          email: username,
          archivedAt: null,
        },
      });

      if (!user) {
        throw new DataNotFoundError("user not found");
      }

      let flag = await bcrypt
        .compare(password, user.password)
        .then(async (result) => {
          return result;
        });

      if (!flag) {
        throw new DataForbiddenError("Incorrect password");
      }

      return {
        username: user.email,
        password: user.password,
        id: user.id,
      };
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },

  saveToken: async (token, client, user) => {
    logger.info("save token route is accessed");

    try {
      const payload = {
        accessToken: token.accessToken,
        expiresIn: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresIn: token.refreshTokenExpiresAt,
        scope: token.scope,
        tokenType: "Bearer",
        clientId: client.id,
        userId: user.id,
      };

      await Token.create(payload);

      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        scope: token.scope,
        client: { id: client.clientId },
        user: { id: user.userId },
      };
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },

  validateScope: async (user, client, scope) => {
    logger.info("validate route is accessed");

    try {
      if (!scope.split(" ").every((s) => VALID_SCOPES.indexOf(s) >= 0)) {
        throw new DataForbiddenError("Invalid scopes");
      }
      return scope;
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },

  revokeToken: async (token) => {
    logger.info("revokeToken route is accessed");

    try {
      const tokenItem = await Token.findOne({
        where: { refreshToken: token.refreshToken, archivedAt: null },
      });

      if (!tokenItem) {
        throw new DataForbiddenError("Invalid Token");
      } else {
        await Token.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              refreshToken: tokenItem.refreshToken,
            },
          }
        );
        return true;
      }
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },

  getRefreshToken: async (refreshToken) => {
    logger.info("getRefresh token route is accessed");

    try {
      const tokenItem = await Token.findOne({
        where: {
          refreshToken,
          archivedAt: null,
        },
        include: [
          {
            model: User,
            as: "user",
            required: false,
            where: {
              archivedAt: null,
            },
          },
          {
            model: Client,
            as: "client",
            required: false,
            where: {
              archivedAt: null,
            },
          },
        ],
      });

      if (!tokenItem) {
        throw new DataForbiddenError("Invalid token");
      }

      return {
        refreshToken: tokenItem.refreshToken,
        refreshTokenExpiresAt: tokenItem.refreshTokenExpiresIn,
        scope: tokenItem.scope,
        client: { id: tokenItem.client.clientId },
        user: { id: tokenItem.user.id },
      };
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },

  getAccessToken: async (accessToken) => {
    logger.info("get access token route is accessed");

    try {
      const tokenItem = await Token.findOne({
        where: {
          accessToken,
          archivedAt: null,
        },
        include: [
          {
            model: User,
            as: "user",
            required: false,
            where: {
              archivedAt: null,
            },
          },
          {
            model: Client,
            as: "client",
            required: false,
            where: {
              archivedAt: null,
            },
          },
        ],
      });

      if (!tokenItem) {
        throw new DataForbiddenError("Invalid token");
      }

      return {
        accessToken: tokenItem.accessToken,
        accessTokenExpiresAt: tokenItem.expiresIn,
        scope: tokenItem.scope,
        client: { id: tokenItem.client.clientId },
        user: { id: tokenItem.user.id },
      };
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return false;
    }
  },
};
