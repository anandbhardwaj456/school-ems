const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ParentStudent = sequelize.define("ParentStudent", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  relation: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: "parent_students"
});

module.exports = ParentStudent;
