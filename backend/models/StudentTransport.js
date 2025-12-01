const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StudentTransport = sequelize.define(
  "StudentTransport",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pickupStop: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dropStop: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "student_transports",
  }
);

module.exports = StudentTransport;
