require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");

const publicRoutes = require("./src/routers/public.routes");

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.use("/public", publicRoutes);

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
