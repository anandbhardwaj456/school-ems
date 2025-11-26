const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AttendanceEntry = sequelize.define("AttendanceEntry", {
  entryId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PRESENT", "ABSENT", "LATE", "HALF_DAY"),
    allowNull: false,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "attendance_entries",
});

module.exports = AttendanceEntry;
