// config/db.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST || "localhost",
  dialect: "mysql", // or postgres
  logging: false,
});

module.exports = sequelize;
