const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StudentFeeAssignment = sequelize.define(
  "StudentFeeAssignment",
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
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "student_fee_assignments",
  }
);

module.exports = StudentFeeAssignment;
