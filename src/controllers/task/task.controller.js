const { Task, Category, Subtask, Tag, TaskTag } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const {
  successResponse,
  errorResponse,
  getDifference,
  arrayToObjectArray,
  calcTaskTime,
} = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const {
  taskRegister,
  taskUpdate,
  taskStatusUpdate,
} = require("../../utilities/validations/task");

const { DataNotFoundError } = require("../../utilities/views/errorResponse");

const { Op } = require("sequelize");

module.exports = {
  create: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await taskRegister.validateAsync(req.body);

      let oauth = res.locals.oauth.token;
      let { name, categoryName, addToMyDay } = value;

      const category = await Category.findOne({
        where: {
          name: categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      let testCategory;

      //creating new category if category not found
      if (!category) {
        const categoryPayload = {
          id: uuidv4(),
          name: categoryName,
          userId: oauth.user.id,
        };
        Category.create(categoryPayload);

        testCategory = categoryPayload;
      }

      let dueDate = addToMyDay ? new Date(addToMyDay) : new Date();
      dueDate.setDate(dueDate.getDate() + 1);

      const payload = {
        id: uuidv4(),
        name: name,
        userId: oauth.user.id,
        categoryId: category ? category.id : testCategory.id,
        categoryName: category ? category.name : testCategory.name,
        dueDate: dueDate.toUTCString(),
        reminderDate: dueDate.toUTCString(),
        addToMyDay: addToMyDay?.toUTCString(),
        status: "pending",
        totalTime: 0,
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
    logger.info(`${req.url} route is accessed with method ${req.method}`);
    try {
      const value = await taskUpdate.validateAsync(req.body);

      let oauth = res.locals.oauth.token;

      const task = await Task.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
        include: [
          {
            model: Subtask,
            as: "subtasks",
            required: false,
            where: {
              archivedAt: null,
            },
          },
          {
            model: Tag,
            as: "tags",
            required: false,
            where: {
              archivedAt: null,
            },
          },
        ],
      });

      if (!task) {
        throw new DataNotFoundError("Task not found");
      }

      const newTagObj = arrayToObjectArray(value.tags, "tagName");

      const newCategory = await Category.findOne({
        where: {
          name: value.categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!newCategory) {
        throw new DataNotFoundError("Please choose existing category");
      }

      //updating tags

      //getting oldtags that are not present in the new array of tags

      const diffTags = getDifference(task.tags, newTagObj, "name", "tagName");
      const tagCollection = await Tag.findAll({
        where: {
          name: {
            [Op.in]: diffTags,
          },
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      tagCollection.map(async (oldTag) => {
        await TaskTag.destroy({
          where: {
            tagId: oldTag.id,
            taskId: req.params.id,
          },
        });
      });

      //iterating the new array of tags and creating and updating accordingly

      const newAddedTags = getDifference(
        newTagObj,
        task.tags,
        "tagName",
        "name"
      );

      newAddedTags.map(async (tag) => {
        let checkTag = await Tag.findOne({
          where: {
            name: tag,
            userId: oauth.user.id,
            archivedAt: null,
          },
        });

        // let testCheckTag;

        if (!checkTag) {
          const tagPayload = {
            id: uuidv4(),
            name: tag,
            userId: oauth.user.id,
          };

          const newTag = await Tag.create(tagPayload);

          const payload = {
            taskId: req.params.id,
            tagId: newTag.id,
          };

          TaskTag.create(payload);
        } else {
          const payload = {
            taskId: req.params.id,
            tagId: checkTag.id,
          };

          TaskTag.create(payload);
        }
      });

      //update subtasks

      //getting oldsubtask that are not present in the new array of subtasks

      const diffSubtasks = getDifference(
        task.subtasks,
        value.subtasks,
        "id",
        "id"
      );

      await Subtask.update(
        {
          archivedAt: new Date().toUTCString(),
        },
        {
          where: {
            id: {
              [Op.in]: diffSubtasks,
            },
            taskId: req.params.id,
          },
        }
      );

      //iterating the new array of subtasks and creating and updating accordingly

      value.subtasks.map(async (subtask) => {
        const updatedSubtask = await Subtask.findOne({
          where: {
            id: subtask.id,
            taskId: req.params.id,
            archivedAt: null,
          },
        });

        if (!updatedSubtask) {
          const payload = {
            id: uuidv4(),
            name: subtask.name,
            taskId: req.params.id,
            status: subtask?.status || "pending",
            startTime: subtask.startTime,
            endTime: subtask.endTime,
          };

          Subtask.create(payload);
        } else {
          await Subtask.update(
            {
              name: subtask.name,
              status: subtask.status,
              startTime: subtask.startTime,
              endTime: subtask.endTime,
            },
            {
              where: {
                id: updatedSubtask.id,
                taskId: req.params.id,
              },
            }
          );
        }
      });

      await Task.update(
        {
          name: value.name,
          categoryId: newCategory.id,
          categoryName: value.categoryName,
          description: value.description,
          priority: value.priority,
          dueDate: value.dueDate.toUTCString(),
          reminderDate: value.reminderDate.toUTCString(),
          repeat: value.repeat,
          addToMyDay: value.addToMyDay.toUTCString(),
          status: value.status,
          totalTime: calcTaskTime(value.subtasks),
        },
        {
          where: {
            id: req.params.id,
            userId: oauth.user.id,
          },
        }
      );

      const updatedTask = await Task.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
        attributes: { exclude: ["archivedAt", "createdAt", "updatedAt"] },
      });

      const updatedTags = await Tag.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
        include: {
          model: Task,
          as: "tasks",
          where: {
            id: updatedTask.id,
            archivedAt: null,
          },
          attributes: ["id", "name"],
        },
        attributes: ["id", "name"],
      });

      const updatedSubtasks = await Subtask.findAll({
        where: {
          taskId: updatedTask.id,
          archivedAt: null,
        },
        attributes: {
          exclude: ["archivedAt", "createdAt", "updatedAt", "taskId"],
        },
      });

      const temp = updatedTask.dataValues;
      temp["subtasks"] = updatedSubtasks;
      temp["tags"] = updatedTags;

      return successResponse(req, res, temp);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  updateStatus: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;
      const value = await taskStatusUpdate.validateAsync(req.body);

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
        await Task.update(
          {
            status: value.status,
          },
          {
            where: {
              id: req.params.id,
              userId: oauth.user.id,
            },
          }
        );
      }

      return successResponse(
        req,
        res,
        `${task.name} status updated successfully`
      );
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

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
            archivedAt: new Date().toUTCString(),
          },
          {
            where: {
              taskId: req.params.id,
            },
          }
        );

        await TaskTag.destroy({
          where: {
            taskId: req.params.id,
          },
        });

        await Task.update(
          {
            archivedAt: new Date().toUTCString(),
          },
          {
            where: {
              id: req.params.id,
              userId: oauth.user.id,
            },
          }
        );
      }

      return successResponse(req, res, `${task.name} deleted successfully`);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  get: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

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
            required: false,
            where: {
              archivedAt: null,
            },
            attributes: {
              exclude: ["archivedAt", "createdAt", "updatedAt", "taskId"],
            },
          },
          {
            model: Tag,
            as: "tags",
            required: false,
            where: {
              archivedAt: null,
            },
            attributes: ["id", "name"],
          },
        ],
        attributes: {
          exclude: ["archivedAt", "createdAt", "updatedAt"],
        },
      });

      return successResponse(req, res, tasks);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
