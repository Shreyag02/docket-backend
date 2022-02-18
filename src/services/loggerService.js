const pino = require("pino");

module.exports = pino({
  autoLogging: true,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      errorLikeObjectKeys: ["err", "error"],
      messageKey: "msg",
      levelKey: "level",
      messageFormat:
        "{req.method} {req.url} {res.statusCode} msg:{msg} {req.headers.host} {responseTime}",
      timestampKey: "time",
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
      hideObject: false,
      singleLine: false,
    },
  },
});
