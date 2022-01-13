const clientController = require("../controllers/client/client.controller");

const userController = require("../controllers/user/user.controller");

const oauthServer = require("../controllers/oAuth/server");

const router = require("express").Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/deleteUser", userController.delete);

router.post("/getClient", clientController.getClient);
router.post("/registerClient", clientController.register);
router.post("/deleteClient", clientController.delete);

router.post(
  "/token",
  (req, res, next) => {
    next();
  },
  oauthServer.token({
    requireClientAuthentication: {
      password: true,
    },
  })
);
module.exports = router;
