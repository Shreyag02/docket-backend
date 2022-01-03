const userController = require("../controllers/user/user.controller");

const clientController = require("../controllers/client/client.controller");

const router = require("express").Router();

router.post("/login", userController.login);

router.post("/register", userController.register);

router.post("/loginClient", clientController.login);

router.post("/registerClient", clientController.register);

module.exports = router;
