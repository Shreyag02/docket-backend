require("dotenv").config();
const express = require("express");
const oauthServer = require("./src/controllers/oAuth/server");

const db = require("./src/models");

const publicRoutes = require("./src/routers/public.routes");
const secureRoutes = require("./src/routers/secure.routes");

const expressPinoLogger = require("express-pino-logger");
const logger = require("./src/services/loggerService");

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

let cors = require("cors");
const app = express();

//cors enabling
app.use(cors());

//read json and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//pino logger
const loggerMidlleware = expressPinoLogger({
  logger: logger,
  autoLogging: true,
});

app.use(loggerMidlleware);

//ROUTES
app.use("/public", publicRoutes);
app.use(
  "/secure",
  (req, res, next) => {
    return next();
  },
  oauthServer.authenticate(),
  secureRoutes
);

try {
  db.sequelize.authenticate();
  logger.info("Connection has been established successfully.");
} catch (error) {
  logger.info(error.stack);
  logger.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => logger.info(`Listening on port: ${PORT}`));
