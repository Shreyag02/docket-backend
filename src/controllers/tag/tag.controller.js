const { Tag } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const { successResponse, errorResponse } = require("../../utilities/helper");

module.exports = {
  create: async (req, res) => {
    try {
      console.log("testing token", res.locals.oauth.token);

      let { tagName } = req.body;
      let oauth = res.locals.oauth.token;

      const tag = await Tag.findOne({
        where: {
          name: tagName,
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      if (tag) {
        return errorResponse(req, res, "Tag exist with same name", 409);
      }

      const payload = {
        id: uuidv4(),
        name: tagName,
        userId: oauth.user.id,
      };

      console.log(payload);

      Tag.create(payload);

      return successResponse(req, res, payload);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      const tag = await Tag.findOne({
        where: {
          name: req.params.id,
          userId: oauth.user.id,
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
              name: req.params.id,
              userId: oauth.user.id,
            },
          }
        );
      }

      return successResponse(req, res, tag);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  get: async (req, res) => {
    try {
      let oauth = res.locals.oauth.token;

      const tags = await Tag.findAll({
        where: {
          userId: oauth.user.id,
          archivedAt: null,
        },
      });

      return successResponse(req, res, tags);
    } catch (error) {
      console.log(error);
      console.log(error.stack);

      return errorResponse(req, res, error.message);
    }
  },
};
