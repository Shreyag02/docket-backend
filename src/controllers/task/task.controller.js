const { Task, Category, Subtask, Tag } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

const { taskRegister } = require("../../utilities/validations/task");
const { DataNotFoundError } = require("../../utilities/views/errorResponse");

module.exports = {
  create: async (req, res) => {
    try {
      const value = await taskRegister.validateAsync(req.body);

      let oauth = res.locals.oauth.token;
      let { taskName, categoryName, addToMyDay } = value;

      const category = await Category.findOne({
        where: {
          name: categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!category) {
        throw new DataNotFoundError("Category not found");
      }

      let dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);

      const payload = {
        id: uuidv4(),
        name: taskName,
        userId: oauth.user.id,
        categoryId: category.id,
        dueDate,
        addToMyDay,
        status: "pending",
      };

      Task.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
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
        throw new DataNotFoundError("Task not found");
      } else {
        let newCategoryId = null;

        //update subtasks
        if (req.body.subtasks) {
          req.body.subtasks?.map((subtask) => {
            const payload = {
              id: uuidv4(),
              name: subtask?.subtaskName,
              taskId: req.body.taskId,
              status: subtask?.status || "pending",
            };

            Subtask.create(payload);
          });
        }
        //create tags

        if (req.body.categoryName) {
          const newCategory = await Category.findOne({
            name: categoryName,
            userId: oauth.user.id,
          });

          if (!newCategory) {
            throw new DataNotFoundError("Category does not exist");
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
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!task) {
        throw new DataNotFoundError("Task not found");
      } else {
        await Subtask.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              taskId: req.params.id,
            },
          }
        );

        await Task.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              id: req.params.id,
              userId: oauth.user.id,
            },
          }
        );
      }

      return successResponse(req, res, task);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  get: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      let whereStatement = {
        userId: oauth.user.id,
        archivedAt: null,
      };

      if (req.query.status) {
        whereStatement.status = req.query.status;
      }
      if (req.params.id) {
        whereStatement.id = req.params.id;
      }

      const tasks = await Task.findAll({
        where: whereStatement,
        include: [
          {
            model: Subtask,
            as: "subtasks",
          },
          {
            model: Tag,
            as: "tags",
          },
        ],
      });

      return successResponse(req, res, tasks);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
