const { genSaltSync, hashSync } = require("bcrypt");
const salt = genSaltSync(10);

const logger = require("../services/loggerService");

module.exports = {
  encryptData: (value) => {
    logger.info("data encrypted");

    return hashSync(value, salt);
  },

  successResponse: (req, res, data, meta = null) => {
    logger.info("sending success response");

    return res.send({
      data,
      error: null,
      success: true,
      meta: null,
    });
  },

  errorResponse: (req, res, errorMessage = "Something went wrong", data) => {
    logger.error("sending error response");

    if (data.name === "ValidationError") {
      data.code = "409";
      data.status = "CONFLICT";
    }

    res.status(data.code || 500).json({
      data: null,
      error: {
        errorCode: data.code || 500,
        errorStatus: data.status || "Internal Server Error",
        errorMessage,
      },
      success: false,
      meta: null,
    });
    return;
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

    return array1.map((a) => a[key1]);
  },

  arrayToObjectArray: (arr, key) => {
    logger.info("converting array into array of objects");

    let convertedArray = [];
    arr.map((item) => {
      convertedArray.push({
        [key]: item,
      });
    });

    return convertedArray;
  },

  calcTaskTime: (subtaskArr) => {
    let hours = 0;
    let minutes = 0;
    subtaskArr.map((subtask) => {
      let startTime = subtask.startTime.split(":");
      let endTime = subtask.endTime.split(":");

      hours = hours + (endTime[0] - startTime[0]);
      minutes = minutes + (endTime[1] - startTime[1]);
    });

    return hours * 60 + minutes;
  },
};
