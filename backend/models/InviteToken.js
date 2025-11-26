const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InviteToken = sequelize.define("InviteToken", {
  tokenId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM("teacher"),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  maxUses: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM("ACTIVE", "EXPIRED", "USED", "REVOKED"),
    defaultValue: "ACTIVE"
  }
}, {
  timestamps: true,
  tableName: "invite_tokens"
});

module.exports = InviteToken;
