const { genSaltSync, hashSync } = require("bcrypt");
const salt = genSaltSync(10);

module.exports = {
  encryptData: (value) => {
    return hashSync(value, salt);
  },
  successResponse: (req, res, data) =>
    res.send({
      data,
      error: null,
      success: true,
      meta: null,
    }),

  errorResponse: (req, res, errorMessage = "Something went wrong", data) =>
    res.status(data.code || 500).json({
      data: null,
      error: {
        errorCode: data.code || 500,
        errorStatus: data.status || "Internal Server Error",
        errorMessage,
      },
      success: false,
      meta: null,
    }),

  generateRandomId: (length) => {
    {
      let result = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
  },
};
