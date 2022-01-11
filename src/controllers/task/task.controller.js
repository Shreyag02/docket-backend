const { Task } = require("../../models");
const { v4: uuidv4 } = require("uuid");

const {
  successResponse,
  errorResponse,
  encryptData,
} = require("../../utilities/helper");

const bcrypt = require("bcrypt");
module.exports = {
  create: async (req, res) => {
    try {
      let { taskName, categoryId, userId } = req.body;
      console.log(req.body);

      console.log(Task);
      //   const task = await User.findOne({
      //     where: { email },
      //   });
      //   if (user) {
      //     return errorResponse(
      //       req,
      //       res,
      //       "User already exists with same email",
      //       409
      //     );
      //   }

      const payload = {
        taskId: uuidv4(),
        taskName,
        categoryId,
        userId,
      };
      console.log(payload);

      Task.create(payload);
      return successResponse(req, res, {});
    } catch (error) {
      console.log(error);
      console.log(error.stack);
      return errorResponse(req, res, error.message);
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return errorResponse(req, res, "Incorrect Email Id", 403);
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then(() => console.log("true"))
        .catch(() => errorResponse(req, res, "Incorrect Password", 403));

      return successResponse(req, res, user);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};
