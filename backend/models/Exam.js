const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Exam = sequelize.define("Exam", {
  examId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  examTypeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  classId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sectionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  maxMarks: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("SCHEDULED", "ONGOING", "COMPLETED", "PUBLISHED"),
    defaultValue: "SCHEDULED",
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "exams",
});

module.exports = Exam;
