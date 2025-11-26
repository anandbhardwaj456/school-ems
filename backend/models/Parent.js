const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Parent = sequelize.define("Parent", {
  parentId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phoneAlt: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: "parents"
});

module.exports = Parent;
