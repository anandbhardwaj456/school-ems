const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Announcement = sequelize.define(
  "Announcement",
  {
    announcementId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetType: {
      type: DataTypes.ENUM("ALL", "CLASS", "SECTION", "ROLE", "STUDENT"),
      defaultValue: "ALL",
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "teacher", "student", "parent"),
      allowNull: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "announcements",
  }
);

module.exports = Announcement;
