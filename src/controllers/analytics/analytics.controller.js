const { Category, Task } = require("../../models");

const { successResponse, errorResponse } = require("../../utilities/helper");

const logger = require("../../services/loggerService");

const { Op } = require("sequelize");
const {
  analyticsSuccess,
  analyticsHours,
} = require("../../utilities/validations/analytics");

module.exports = {
  getTaskSuccess: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      const value = await analyticsSuccess.validateAsync(req.body);
      let oauth = res.locals.oauth.token;

      let startDate = new Date(value.startDate);
      let endDate = new Date(value.endDate);
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

      return errorResponse(req, res, error.message, error);
    }
  },

  getCategoryTime: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;
      const value = await analyticsSuccess.validateAsync(req.body);

      let startDate = new Date(value.startDate);
      let endDate = new Date(value.endDate);
      endDate.setDate(endDate.getDate() + 1);

      const categories = await Category.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
        include: {
          model: Task,
          as: "tasks",
          where: {
            archivedAt: null,
            createdAt: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
      });

      let response = [];

      categories.map((category) => {
        let tTime = 0;

        category.tasks.map((task) => {
          tTime = tTime + task.totalTime;
        });

        response.push({
          id: category.id,
          categoryName: category.name,
          time: tTime,
        });
      });

      return successResponse(req, res, response);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },

  getWorkingHoursBreakdown: async (req, res) => {
    logger.info(`${req.url} route is accessed with method ${req.method}`);

    try {
      let oauth = res.locals.oauth.token;
      const value = await analyticsHours.validateAsync(req.body);

      let startDate = new Date(value.startDate);
      let endDate = new Date(value.endDate);
      endDate.setDate(endDate.getDate() + 1);

      const categories = await Category.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
        include: {
          model: Task,
          as: "tasks",
          where: {
            archivedAt: null,
            createdAt: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
      });

      let response = [];

      categories.map((category) => {
        let tTime = 0;

        category.tasks.map((task) => {
          tTime = tTime + task.totalTime;
        });

        response.push({
          id: category.id,
          categoryName: category.name,
          time: tTime,
        });
      });

      return successResponse(req, res, response);
    } catch (error) {
      logger.error(error);
      logger.error(error.stack);

      return errorResponse(req, res, error.message, error);
    }
  },
};
