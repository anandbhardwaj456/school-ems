const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ClassSubject = sequelize.define(
  "ClassSubject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "class_subjects",
  }
);

module.exports = ClassSubject;
