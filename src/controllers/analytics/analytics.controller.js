const { Category, Task } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const { categoryRegister } = require("../../utilities/validations/category");
const {
  DataNotFoundError,
  DataDuplicateError,
} = require("../../utilities/views/errorResponse");
const { Op } = require("sequelize");

module.exports = {
  getTaskSuccess: async (req, res) => {
    logger.info("get task success route is accessed");

    try {
      // const value = await taskSuccess
      let oauth = res.locals.oauth.token;
      const { startDate, endDate } = req.body;

      // let todayStart = new Date().setHours(0, 0, 0, 0);
      // let current = new Date();

      // let oldMonth = new Date();
      // oldMonth.setUTCMonth(oldMonth.getUTCMonth() - 1);

      // let oldYear = new Date();
      // oldYear.setUTCFullYear(oldYear.getUTCFullYear() - 1);

      // let whereStatement = {
      //   userId: oauth.user.id,
      //   archivedAt: null,
      // };

      // console.log({ todayStart, current, oldMonth, oldYear });

      // if ((req.query.range = "today")) {
      //   whereStatement.createdAt = {
      //     [Op.gte]: todayStart,
      //     [Op.lte]: current,
      //   };
      // }

      // if ((req.query.range = "month")) {
      //   whereStatement.createdAt = {
      //     [Op.gte]: oldMonth,
      //     [Op.lte]: current,
      //   };
      // }

      const pendingTasks = await Task.findAndCountAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
          createdAt: {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate),
          },
          status: "pending",
        },
      });

      const completedTasks = await Task.findAndCountAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
          createdAt: {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate),
          },
          status: "pending",
        },
      });

      const response = {
        userId: oauth.user.id,
        totalTasks: pendingTasks + completedTasks,
        pendingTasks,
        completedTasks,
        successPercentage: `${
          (completedTasks / (pendingTasks + completedTasks)) * 100
        }%`,
      };

      return successResponse(req, res, response);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message);
    }
  },
};
