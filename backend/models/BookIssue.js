const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BookIssue = sequelize.define(
  "BookIssue",
  {
    issueId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    issuedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dueOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    returnedOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fineAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: "book_issues",
  }
);

module.exports = BookIssue;
