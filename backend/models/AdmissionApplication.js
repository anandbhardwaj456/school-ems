const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdmissionApplication = sequelize.define("AdmissionApplication", {
  applicationId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  classAppliedFor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      "PENDING",
      "UNDER_ASSESSMENT",
      "ASSESSMENT_PASSED",
      "ASSESSMENT_FAILED",
      "ACCEPTED",
      "REJECTED"
    ),
    defaultValue: "PENDING"
  },
  assessmentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  assessmentScore: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: "admission_applications"
});

module.exports = AdmissionApplication;
