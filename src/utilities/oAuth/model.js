const { Client, AuthorizationCode, Token } = require("../../models");
const { encryptData } = require("../helper");

const db = {
  authorizationCode: AuthorizationCode,
  client: Client,
  token: Token,
};

const VALID_SCOPES = ["read", "write"];

module.exports = {
  getClient: async (clientId, clientSecret) => {
    console.log("getclient");
    const client = await db.client.findOne({
      where: { clientId },
    });
    console.log({
      id: client.clientId,
      redirectUris: client.dataUris,
      grants: client.grants,
    });
    if (client && client.clientSecret == clientSecret) {
      return {
        id: client.clientId,
        redirectUris: client.dataUris,
        grants: client.grants,
      };
    }
  },
  getUser: (username, password) => {
    console.log("getuser");

    const user = db.user.findOne({
      where: { email: username },
    });
    console.log({ username: user.email, password: user.password });

    if (user && user.password == encryptData(password)) {
      return { username: user.email, password: user.password };
    }
  },

  saveToken: async (token, client, user) => {
    console.log("savetoken");

    const payload = {
      accessToken: token.accessToken,
      expiresIn: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      clientId: client.clientId,
      userId: user.userId,
      scope: token.scope,
    };

    console.log({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      scope: token.scope,
      client: { id: client.clientId },
      user: { id: user.userId },
    });
    await db.token.create(payload);
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      scope: token.scope,
      client: { id: client.clientId },
      user: { id: user.userId },
    };
    // return new Promise(resolve => resolve(db.token))
  },

  validateScope: (user, client, scope) => {
    if (!scope.split(" ").every((s) => VALID_SCOPES.indexOf(s) >= 0)) {
      return false;
    }
    return scope;
  },
};

//password

// generateAccessToken(client, user, scope, [callback]) default
// generateRefreshToken(client, user, scope, [callback]) default

// getClient(clientId, clientSecret, [callback])
// getUser(username, password, [callback])

// saveToken(token, client, user, [callback])
// validateScope(user, client, scope, [callback])

// {
//   "clientId":"m8sYM0JWY1J0rIMDVE4kcNvPF0GeZcX8ND2ThcG7XFvUSEmd",
//   "clientSecret":"GsRHF3cdw9DRQ0g3KLQXLK84Gx5CaduL9XuMHvWglfhKj2gD",
//   "password": "Test@124",
//   "email": "Test1@gmail.com"
// }
