require("dotenv").config();
const express = require("express");
const db = require("./src/models");
const publicRoutes = require("./src/routers/public.routes");

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", publicRoutes);

try {
  db.sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.log(error.stack);
  console.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
