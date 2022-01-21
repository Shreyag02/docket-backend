const categoryController = require("../controllers/category/category.controller");

const tagController = require("../controllers/tag/tag.controller");

const taskController = require("../controllers/task/task.controller");

const router = require("express").Router();

router.post("/createTag", tagController.create);
router.get("/tags", tagController.get);
router.delete("/deleteTag", tagController.delete);

router.post("/createCategory", categoryController.create);
router.get("/categories", categoryController.get);
router.delete("/deleteCategory", categoryController.delete);

router.post("/createTask", taskController.create);
router.put("/updateTask", taskController.update);
router.get("/tasks", taskController.get);
router.delete("/deleteTask", taskController.delete);

module.exports = router;
