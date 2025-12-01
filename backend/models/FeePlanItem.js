const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeePlanItem = sequelize.define(
  "FeePlanItem",
  {
    itemId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "fee_plan_items",
  }
);

module.exports = FeePlanItem;
