const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeeInvoice = sequelize.define(
  "FeeInvoice",
  {
    invoiceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "PARTIAL", "OVERDUE"),
      defaultValue: "PENDING",
    },
  },
  {
    timestamps: true,
    tableName: "fee_invoices",
  }
);

module.exports = FeeInvoice;
