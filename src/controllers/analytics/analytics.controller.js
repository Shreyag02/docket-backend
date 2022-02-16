const { Category, Task } = require("../../models");

const { successResponse, errorResponse } = require("../../utilities/helper");

const logger = require("../../services/loggerService");

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
      // const { startDate, endDate } = req.body;

      let startDate = new Date(req.body.startDate);
      let endDate = new Date(req.body.endDate);
      endDate.setDate(endDate.getDate() + 1);

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
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
          status: "pending",
        },
      });
      console.log({
        startDate,
        endDate,
      });

      const completedTasks = await Task.findAndCountAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
          status: "completed",
        },
      });

      console.log({ pendingTasks, completedTasks });

      let successPercentage;

      if (pendingTasks.count + completedTasks.count === 0)
        successPercentage = 0;
      else
        successPercentage = (
          (completedTasks.count / (pendingTasks.count + completedTasks.count)) *
          100
        ).toFixed(2);

      const response = {
        userId: oauth.user.id,
        totalTasks: pendingTasks.count + completedTasks.count,
        pendingTasks: pendingTasks.count,
        completedTasks: completedTasks.count,
        successPercentage: `${successPercentage}%`,
      };

      return successResponse(req, res, response);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message);
    }
  },
};
