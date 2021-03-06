const userController = require("../controllers/user/user.controller");

const categoryController = require("../controllers/category/category.controller");

const tagController = require("../controllers/tag/tag.controller");

const taskController = require("../controllers/task/task.controller");
const analyticsController = require("../controllers/analytics/analytics.controller");

const router = require("express").Router();

router.delete("/deleteUser", userController.delete);

router.post("/createTag", tagController.create);
router.get("/tags", tagController.get);
router.get("/tagTasks/:id", tagController.getTasks);
router.delete("/deleteTag/:id", tagController.delete);

router.post("/createCategory", categoryController.create);
router.get("/categories", categoryController.get);
router.get("/categoryTasks/:id", categoryController.getTasks);
router.delete("/deleteCategory/:id", categoryController.delete);

router.post("/createTask", taskController.create);
router.put("/updateTask/:id", taskController.update);
router.patch("/updateTaskStatus/:id", taskController.updateStatus);
router.get("/tasks/:id", taskController.get);
router.get("/tasks", taskController.get);
router.delete("/deleteTask/:id", taskController.delete);

router.get("/taskSuccess", analyticsController.getTaskSuccess);
router.get("/categoryTime", analyticsController.getCategoryTime);
router.get(
  "/workingHoursBreakdown",
  analyticsController.getWorkingHoursBreakdown
);

module.exports = router;
