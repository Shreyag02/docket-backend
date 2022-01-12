const { Task, Category } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

module.exports = {
  create: async (req, res) => {
    try {
      let { taskName, categoryName, userId } = req.body;
      console.log(req.body);
      console.log(Task);

      const category = await Category.findOne({
        categoryName,
        userId,
      });
      if (!category) {
        return errorResponse(req, res, "Category does not exist", 409);
      }
      let dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);

      const payload = {
        id: uuidv4(),
        taskName,
        userId,
        categoryId: category.id,
        createDate: new Date(),
        dueDate,
        addToMyDay: false,
        status: "pending",
      };
      console.log(payload);

      Task.create(payload);
      return successResponse(req, res, {});
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  update: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.body.taskId,
          userId: req.body.userId,
        },
      });

      if (!task) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        let newCategoryId = null;

        if (req.body.categoryName) {
          const newCategory = await Category.findOne({
            categoryName,
            userId,
          });

          if (!newCategory) {
            return errorResponse(req, res, "Category does not exist", 409);
          } else newCategoryId = newCategory.id;
        }

        await Task.update(
          {
            taskName: req.body.taskName || task.taskName,
            categoryId: newCategoryId || task.categoryId,
            dueDate: req.body.dueDate || task.dueDate,
            addToMyDay: req.body.addToMyDay || task.addToMyDay,
            status: req.body.status || task.status,
          },
          {
            where: {
              id: req.body.taskId,
              userId: req.body.userId,
            },
          }
        );
      }

      return successResponse(req, res, task);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          id: req.body.taskId,
          userId: req.body.userId,
          archivedAt: null,
        },
      });

      if (!task) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        await Task.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              id: req.body.taskId,
              userId: req.body.userId,
            },
          }
        );
      }

      return successResponse(req, res, task);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
