const { Task, Category, Subtask, Tag, TaskTag } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const {
  successResponse,
  errorResponse,
  getDifference,
} = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const {
  taskRegister,
  taskUpdate,
} = require("../../utilities/validations/task");

const { DataNotFoundError } = require("../../utilities/views/errorResponse");
const { Op } = require("sequelize");

module.exports = {
  create: async (req, res) => {
    logger.info("task create route is accessed");

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
    logger.info("task update route is accessed");

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

      let newCategoryId = null;

      //update subtasks

      //getting oldsubtask that are not present in the new array of subtasks

      const diffSubtasks = getDifference(
        task.subtasks,
        value.subtasks,
        "id",
        "id"
      );

      logger.info("iam difference in subtask");
      console.log(diffSubtasks);

      await Subtask.update(
        {
          archivedAt: new Date(),
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
        if (subtask.id === "") {
          const payload = {
            id: uuidv4(),
            name: subtask.subtaskName,
            taskId: req.params.id,
            status: subtask?.status || "pending",
          };

          Subtask.create(payload);
        } else {
          const updatedSubtask = await Subtask.findOne({
            where: {
              id: subtask.id,
              taskId: req.params.id,
              archivedAt: null,
            },
          });

          if (!updatedSubtask) {
            logger.info("Subtask not found");

            // throw new DataNotFoundError(`invalid subtask ${subtask.id}`);
          }

          await Subtask.update(
            {
              name: subtask.subtaskName,
              status: subtask.status,
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

      //updating tags

      //getting oldtags that are not present in the new array of tags
      const diffTags = getDifference(task.tags, value.tags, "name", "tagName");

      logger.info("i am difference in tags");
      console.log(diffTags);

      // await TaskTag.destroy({
      //   where: {
      //     tagId: {
      //       [Op.in]: diffTags,
      //     },
      //     taskId: req.params.id,
      //   },
      //   include:[
      //     {
      //       model:
      //     }
      //   ]
      // });

      //iterating the new array of tags and creating and updating accordingly

      const newAddedTags = getDifference(
        value.tags,
        task.tags,
        "tagName",
        "name"
      );

      logger.info("iam newly afded in tags");
      console.log(newAddedTags);

      newAddedTags.map(async (tag) => {
        logger.info("mapping newlyadded tags");
        let checkTag = null;
        checkTag = await Tag.findOne({
          where: {
            name: tag,
            userId: oauth.user.id,
            archivedAt: null,
          },
        });

        console.log("ia am checktag", checkTag);

        if (checkTag) {
          logger.info("CHECK TAG EXIST");

          const payload = {
            taskId: req.params.id,
            tagId: checkTag.id,
          };

          TaskTag.create(payload);
        } else {
          logger.info("in create function");

          const tagPayload = {
            id: uuidv4(),
            name: tag,
            userId: oauth.user.id,
          };

          Tag.create(tagPayload);
          console.log("241", tagPayload);

          let tagTaskpayload = null;
          tagTaskpayload = {
            taskId: req.params.id,
            tagId: tagPayload.id,
          };

          TaskTag.create(tagTaskpayload);

          logger.info("created checktag");
          console.log({ checkTag });
        }
      });

      const newCategory = await Category.findOne({
        where: {
          name: value.categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!newCategory) {
        throw new DataNotFoundError("Category does not exist");
      }
      newCategoryId = newCategory.id;

      await Task.update(
        {
          name: value.taskName,
          categoryId: newCategoryId,
          description: value.description,
          dueDate: value.dueDate,
          addToMyDay: value.addToMyDay,
          status: value.status,
        },
        {
          where: {
            id: req.params.id,
            userId: oauth.user.id,
          },
        }
      );

      return successResponse(
        req,
        res,
        `${task.name} with id:${req.params.id} updated successfully`
      );
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  delete: async (req, res) => {
    logger.info("task delete route is accessed");

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

        await TaskTag.destroy({
          where: {
            taskId: req.params.id,
          },
        });

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

      return successResponse(req, res, `${task.name} deleted successfully`);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  get: async (req, res) => {
    logger.info("task get route is accessed");

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

      return successResponse(req, res, tasks);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
