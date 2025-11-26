const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ExamMark = sequelize.define("ExamMark", {
  markId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  examId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  marksObtained: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  attendanceStatus: {
    type: DataTypes.ENUM("PRESENT", "ABSENT", "MEDICAL", "EXEMPTED"),
    allowNull: true,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "exam_marks",
});

module.exports = ExamMark;
