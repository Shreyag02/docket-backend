const pino = require("pino");

module.exports = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      crlf: true,
      errorLikeObjectKeys: ["err", "error"],
      errorProps: "",
      levelFirst: true,
      messageKey: "msg",
      levelKey: "level",
      messageFormat: false,
      timestampKey: "time",
      translateTime: true,
      ignore: "pid,hostname",
      hideObject: true,
      singleLine: false,

      // The file or file descriptor (1 is stdout) to write to
      destination: 1,

      // Alternatively, pass a `sonic-boom` instance (allowing more flexibility):
      // destination: new SonicBoom({ dest: 'a/file', mkdir: true })

      // You can also configure some SonicBoom options directly
      sync: false, // by default we write asynchronously
      append: true, // the file is opened with the 'a' flag
      mdkdir: true, // create the target destination,

      customPrettifiers: {
        // The argument for this function will be the same
        // string that's at the start of the log-line by default:
        // time: (timestamp) => `🕰 ${timestamp}`,
        // The argument for the level-prettifier may vary depending
        // on if the levelKey option is used or not.
        // By default this will be the same numerics as the Pino default:
        // level: (logLevel) => `LEVEL: ${logLevel}`,
        // other prettifiers can be used for the other keys if needed, for example
        // hostname: (hostname) => colorGreen(hostname),
        // pid: (pid) => colorRed(pid),
        // name: (name) => colorBlue(name),
        // caller: (caller) => colorCyan(caller),
      },
    },
  },
});
