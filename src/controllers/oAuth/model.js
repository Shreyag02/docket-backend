const { Client, User, Token } = require("../../models");
const bcrypt = require("bcrypt");

const VALID_SCOPES = ["read", "write"];

module.exports = {
  getClient: async (clientId, clientSecret) => {
    console.log("getclient");

    const client = await Client.findOne({
      where: { clientId },
    });

    console.log({
      id: client.clientId,
      redirectUris: client.dataUris,
      grants: client.grants,
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
    console.log("getuser");
    console.log({ username, password });

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
      console.log("executed");
      return { username: user.email, password: user.password, id: user.id };
    } else {
      console.log("not executed");
    }
  },

  saveToken: async (token, client, user) => {
    console.log("savetoken");

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

    console.log("from line 60", token);

    console.log({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      scope: token.scope,
      client: { id: client.id },
      user: { id: user.id },
    });

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
    console.log("REVOKING");

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
      include: [User, Client],
    });

    console.log({ tokenItem });

    if (tokenItem) {
      console.log("returning");

      console.log({
        refreshToken: tokenItem.refreshToken,
        refreshTokenExpiresAt: tokenItem.refreshTokenExpiresIn,
        scope: tokenItem.scope,
        client: tokenItem.Client,
        user: tokenItem.User,
      });

      return {
        refreshToken: tokenItem.refreshToken,
        refreshTokenExpiresAt: tokenItem.refreshTokenExpiresIn,
        scope: tokenItem.scope,
        client: { id: tokenItem.Client.clientId },
        user: { id: tokenItem.User.id },
      };
    }
  },

  getAccessToken: async (accessToken) => {
    // imaginary DB queries

    const tokenItem = await Token.findOne({
      where: { accessToken },
      include: [
        {
          model: User,
          as: "currUser",
        },
        {
          model: Client,
          as: "currClient",
        },
      ],
    });

    const client =
      tokenItem &&
      (await Client.findOne({
        where: { clientId: tokenItem.clientId },
      }));

    console.log(
      "testing associations jlkj",
      tokenItem,
      tokenItem.currUser,
      tokenItem.currClient
    );
    const user =
      tokenItem &&
      (await User.findOne({
        where: { id: tokenItem.userId },
      }));

    if (tokenItem && client && user) {
      console.log("returning");

      // console.log({
      //   accessToken: tokenItem.accessToken,
      //   accessTokenExpiresAt: tokenItem.expiresIn,
      //   scope: tokenItem.scope,
      //   client: { id: client.clientId },
      //   user: { id: user.id },
      // });

      return {
        accessToken: tokenItem.accessToken,
        accessTokenExpiresAt: tokenItem.expiresIn,
        scope: tokenItem.scope,
        client: { id: client.clientId },
        user: { id: user.id },
      };

      // if (tokenItem) {
      //   console.log("returning");

      //   console.log({
      //     accessToken: tokenItem.accessToken,
      //     accessTokenExpiresAt: tokenItem.expiresIn,
      //     scope: tokenItem.scope,
      //     client: { id: tokenItem.Client.clientId },
      //     user: { id: tokenItem.User.id },
      //   });

      //   return {
      //     accessToken: tokenItem.accessToken,
      //     accessTokenExpiresAt: tokenItem.expiresIn,
      //     scope: tokenItem.scope,
      //     client: { id: tokenItem.Client.clientId },
      //     user: { id: tokenItem.User.id },
      //   };
    }
  },
};
