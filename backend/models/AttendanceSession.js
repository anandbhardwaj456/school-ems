const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AttendanceSession = sequelize.define("AttendanceSession", {
  sessionId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
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
  teacherId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("OPEN", "CLOSED"),
    defaultValue: "OPEN",
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "attendance_sessions",
});

module.exports = AttendanceSession;
