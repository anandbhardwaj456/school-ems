const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HomeworkSubmission = sequelize.define(
  "HomeworkSubmission",
  {
    submissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    homeworkId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("SUBMITTED", "LATE", "NOT_SUBMITTED"),
      defaultValue: "SUBMITTED",
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "homework_submissions",
  }
);

module.exports = HomeworkSubmission;
