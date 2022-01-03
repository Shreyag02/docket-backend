const { genSaltSync, hashSync } = require("bcrypt");
const salt = genSaltSync(10);

module.exports = {
  encryptData: (value) => {
    return hashSync(value, salt);
  },
  successResponse: (req, res, data, code = 200) =>
    res.send({
      code,
      data,
      success: true,
    }),
  errorResponse: (
    req,
    res,
    errorMessage = "Something went wrong",
    code = 500,
    error = {}
  ) =>
    res.status(500).json({
      code,
      errorMessage,
      error,
      data: null,
      success: false,
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
