const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define("Student", {
  studentId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  admissionNo: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  classId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sectionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("ACTIVE", "INACTIVE", "ALUMNI", "TC_ISSUED"),
    defaultValue: "ACTIVE"
  }
}, {
  timestamps: true,
  tableName: "students"
});

module.exports = Student;
