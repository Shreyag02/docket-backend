const { genSaltSync, hashSync } = require("bcrypt");
const salt = genSaltSync(10);

const logger = require("../services/loggerService");

module.exports = {
  encryptData: (value) => {
    logger.info("data encrypted");

    return hashSync(value, salt);
  },

  successResponse: (req, res, data) => {
    logger.info("sending success response");
    console.log({
      data,
      error: null,
      success: true,
      meta: null,
    });

    return res.send({
      data,
      error: null,
      success: true,
      meta: null,
    });
  },

  errorResponse: (req, res, errorMessage = "Something went wrong", data) => {
    logger.error("sending error response");
    console.log({
      data: null,
      error: {
        errorCode: data.code || 500,
        errorStatus: data.status || "Internal Server Error",
        errorMessage,
      },
      success: false,
      meta: null,
    });

    return res.status(data.code || 500).json({
      data: null,
      error: {
        errorCode: data.code || 500,
        errorStatus: data.status || "Internal Server Error",
        errorMessage,
      },
      success: false,
      meta: null,
    });
  },

  generateRandomId: (length) => {
    {
      logger.info("generating random id");

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

  //returns values of array 1 that are not present in array 2
  getDifference: (array1, array2, key1, key2) => {
    logger.info("generating difference array");

    array1 = array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1[key1] === object2[key2];
      });
    });

    logger.info("from helper");
    console.log(array1.map((a) => a[key1]));

    return array1.map((a) => a[key1]);
  },
};
