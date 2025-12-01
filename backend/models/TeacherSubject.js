const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TeacherSubject = sequelize.define(
  "TeacherSubject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "teacher_subjects",
  }
);

module.exports = TeacherSubject;
