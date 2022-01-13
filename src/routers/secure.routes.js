const categoryController = require("../controllers/category/category.controller");

const tagController = require("../controllers/tag/tag.controller");

const taskController = require("../controllers/task/task.controller");

const router = require("express").Router();

router.post("/createTag", tagController.create);
router.post("/deleteTag", tagController.delete);

router.post("/createCategory", categoryController.create);
router.post("/deleteCategory", categoryController.delete);

router.post("/createTask", taskController.create);
router.post("/updateTask", taskController.update);
router.post("/deleteTask", taskController.delete);

module.exports = router;
