const userController = require("../controllers/user/user.controller");

const clientController = require("../controllers/client/client.controller");

const oauthServer = require("../utilities/oAuth/server");

const router = require("express").Router();

router.post("/login", userController.login);

router.post("/register", userController.register);

router.post("/loginClient", clientController.login);

router.post("/registerClient", clientController.register);

router.post(
  "/token",
  oauthServer.token({
    requireClientAuthentication: {
      // whether client needs to provide client_secret
      password: true,
    },
  })
);

module.exports = router;
