const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Route = sequelize.define(
  "Route",
  {
    routeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stops: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "routes",
  }
);

module.exports = Route;
