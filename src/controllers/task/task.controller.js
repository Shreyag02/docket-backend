const { Task, Category, Subtask } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

module.exports = {
  create: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;
      let { taskName, categoryName, addToMyDay } = req.body;

      console.log(req.body);
      console.log(Task);

      const category = await Category.findOne({
        where: {
          name: categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!category) {
        return errorResponse(req, res, "Category does not exist", 409);
      }

      let dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);

      const payload = {
        id: uuidv4(),
        taskName,
        userId: oauth.user.id,
        categoryId: category.id,
        dueDate,
        addToMyDay,
        status: "pending",
      };

      console.log(payload);

      Task.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  update: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      const task = await Task.findOne({
        where: {
          id: req.body.taskId,
          userId: oauth.user.id,
        },
      });

      if (!task) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        let newCategoryId = null;

        if (req.body.subtasks) {
          req.body.subtasks.map((subtask) => {
            const payload = {
              id: uuidv4(),
              name: subtask.subtaskName,
              taskId: req.body.taskId,
              status: subtask.status || "pending",
            };

            Subtask.create(payload);
          });
        }

        if (req.body.categoryName) {
          const newCategory = await Category.findOne({
            name: categoryName,
            userId: oauth.user.id,
          });

          if (!newCategory) {
            return errorResponse(req, res, "Category does not exist", 409);
          } else newCategoryId = newCategory.id;
        }

        await Task.update(
          {
            name: req.body.taskName || task.name,
            categoryId: newCategoryId || task.categoryId,
            dueDate: req.body.dueDate || task.dueDate,
            addToMyDay: req.body.addToMyDay || task.addToMyDay,
            status: req.body.status || task.status,
          },
          {
            where: {
              id: req.body.taskId,
              userId: oauth.user.id,
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
      let oauth = res.locals.oauth.token;

      const task = await Task.findOne({
        where: {
          id: req.body.taskId,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!task) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        await Subtask.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              taskId: req.body.taskId,
            },
          }
        );

        await Task.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              id: req.body.taskId,
              userId: oauth.user.id,
            },
          }
        );
      }

      return successResponse(req, res, task);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  get: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;
      console.log("testing params", req.query);

      let tasks;

      if (req.query.status) {
        tasks = await Task.findAll({
          where: {
            userId: oauth.user.id,
            archivedAt: null,
            status: req.query.status,
          },
          include: [Subtask],
        });
      } else {
        tasks = await Task.findAll({
          where: {
            userId: oauth.user.id,
            archivedAt: null,
          },
          include: [
            {
              model: Subtask,
              as: "subtasks",
            },
          ],
        });
      }

      return successResponse(req, res, tasks);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },
};
