const { Client, User, AuthorizationCode, Token } = require("../../models");
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
      clientId: client.id,
      userId: user.id,
      scope: token.scope,
    };

    console.log(client, user);

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
