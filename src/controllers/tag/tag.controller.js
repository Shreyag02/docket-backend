const { Tag } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

module.exports = {
  create: async (req, res) => {
    try {
      let { tagName, userId } = req.body;
      console.log(req.body);
      console.log(Tag);

      const tag = await Tag.findOne({
        tagName,
        userId,
      });
      if (tag) {
        return errorResponse(req, res, "Tag exist with same name", 409);
      }

      const payload = {
        id: uuidv4(),
        tagName,
        userId,
      };
      console.log(payload);

      Tag.create(payload);
      return successResponse(req, res, {});
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const tag = await Tag.findOne({
        where: {
          tagName: req.body.tagName,
          userId: req.body.userId,
          archivedAt: null,
        },
      });

      if (!tag) {
        return errorResponse(req, res, "Something went wrong. Try again", 403);
      } else {
        await Tag.update(
          {
            archivedAt: new Date(),
          },
          {
            where: {
              tagName: req.body.tagName,
              userId: req.body.userId,
            },
          }
        );
      }

      return successResponse(req, res, tag);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
