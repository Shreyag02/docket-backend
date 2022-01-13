require("dotenv").config();
const express = require("express");
const oauthServer = require("./src/controllers/oAuth/server");

const db = require("./src/models");

const publicRoutes = require("./src/routers/public.routes");
const secureRoutes = require("./src/routers/secure.routes");

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

var cors = require("cors");
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");

//   // authorized headers for preflight requests
//   // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();

//   app.options("*", (req, res) => {
//     // allowed XHR methods
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, PATCH, PUT, POST, DELETE, OPTIONS"
//     );
//     res.send();
//   });
// });

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
  console.log("Connection has been established successfully.");
} catch (error) {
  console.log(error.stack);
  console.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
