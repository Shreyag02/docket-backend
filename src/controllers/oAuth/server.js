const OAuthServer = require("express-oauth-server");
const model = require("./model");

module.exports = new OAuthServer({
  model: model,
  grants: ["password", "refresh_token"],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
  requireClientAuthentication: {
    // whether client needs to provide client_secret
    password: true,
  },
});
