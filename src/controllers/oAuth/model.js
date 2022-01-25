const { Client, User, Token } = require("../../models");
const bcrypt = require("bcrypt");

const VALID_SCOPES = ["read", "write"];

module.exports = {
  getClient: async (clientId, clientSecret) => {
    const client = await Client.findOne({
      where: { clientId, archivedAt: null },
    });

    if (client && client.clientSecret === clientSecret) {
      return {
        id: client.clientId,
        redirectUris: client.dataUris,
        grants: client.grants,
      };
    }
  },

  getUser: async (username, password) => {
    const user = await User.findOne({
      where: { email: username },
    });
    let flag = false;

    user &&
      (await bcrypt
        .compare(password, user.password)
        .then(() => {
          flag = true;
        })
        .catch(() => console.log("Incorrect Password")));

    if (flag) {
      return { username: user.email, password: user.password, id: user.id };
    }
  },

  saveToken: async (token, client, user) => {
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
  },

  validateScope: (user, client, scope) => {
    if (!scope.split(" ").every((s) => VALID_SCOPES.indexOf(s) >= 0)) {
      return false;
    }
    return scope;
  },

  revokeToken: async (token) => {
    const tokenItem = await Token.findOne({
      where: { refreshToken: token.refreshToken, archivedAt: null },
    });

    if (!tokenItem) return false;
    else {
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
  },

  getRefreshToken: async (refreshToken) => {
    const tokenItem = await Token.findOne({
      where: { refreshToken },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Client,
          as: "client",
        },
      ],
    });

    if (tokenItem) {
      return {
        refreshToken: tokenItem.refreshToken,
        refreshTokenExpiresAt: tokenItem.refreshTokenExpiresIn,
        scope: tokenItem.scope,
        client: { id: tokenItem.client.clientId },
        user: { id: tokenItem.user.id },
      };
    }
  },

  getAccessToken: async (accessToken) => {
    const tokenItem = await Token.findOne({
      where: { accessToken },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Client,
          as: "client",
        },
      ],
    });

    if (tokenItem) {
      return {
        accessToken: tokenItem.accessToken,
        accessTokenExpiresAt: tokenItem.expiresIn,
        scope: tokenItem.scope,
        client: { id: tokenItem.client.clientId },
        user: { id: tokenItem.user.id },
      };
    }
  },
};
