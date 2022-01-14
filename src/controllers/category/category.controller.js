const { Category } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

module.exports = {
  create: async (req, res) => {
    try {
      let { categoryName, userId } = req.body;
      console.log(req.body);
      console.log(Category);

      const category = await Category.findOne({
        name: categoryName,
        userId,
      });
      if (category) {
        return errorResponse(req, res, "Category exist with same name", 409);
      }

      const payload = {
        id: uuidv4(),
        name: categoryName,
        userId,
      };
      console.log(payload);

      Category.create(payload);
      return successResponse(req, res, payload);
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Category.findOne({
        where: {
          name: req.body.categoryName,
          userId: req.body.userId,
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
              name: req.body.categoryName,
              userId: req.body.userId,
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
