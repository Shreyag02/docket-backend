const { Category } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

module.exports = {
  create: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;
      let { categoryName } = req.body;

      const category = await Category.findOne({
        where: {
          name: categoryName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (category) {
        return errorResponse(
          req,
          res,
          `Category exist with same name ${category} ${categoryName}`,
          409
        );
      }

      const payload = {
        id: uuidv4(),
        name: categoryName,
        userId: oauth.user.id,
      };

      Category.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  get: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      const categories = await Category.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      return successResponse(req, res, categories);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      const category = await Category.findOne({
        where: {
          id: req.params.id,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (!category) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        await Category.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              name: req.params.id,
              userId: oauth.user.id,
            },
          }
        );
      }

      return successResponse(req, res, category);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
