require("dotenv").config();

const config = {
  development: {
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },

  test: {
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },

  production: {
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};

module.exports = config;
