const categoryController = require("../controllers/category/category.controller");

const clientController = require("../controllers/client/client.controller");

const tagController = require("../controllers/tag/tag.controller");

const taskController = require("../controllers/task/task.controller");

const userController = require("../controllers/user/user.controller");

const oauthServer = require("../controllers/oAuth/server");

const router = require("express").Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/deleteUser", userController.delete);

router.post("/getClient", clientController.getClient);
router.post("/registerClient", clientController.register);
router.post("/deleteClient", clientController.delete);

router.post("/createTag", tagController.create);
router.post("/deleteTag", tagController.delete);

router.post("/createCategory", categoryController.create);
router.post("/deleteCategory", categoryController.delete);

router.post("/createTask", taskController.create);
router.post("/updateTask", taskController.update);
router.post("/deleteTask", taskController.delete);

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
