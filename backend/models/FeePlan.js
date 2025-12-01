const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeePlan = sequelize.define(
  "FeePlan",
  {
    planId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "fee_plans",
  }
);

module.exports = FeePlan;
