const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeePayment = sequelize.define(
  "FeePayment",
  {
    paymentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mode: {
      type: DataTypes.ENUM("CASH", "ONLINE", "CHEQUE", "UPI"),
      allowNull: false,
    },
    transactionRef: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gatewayStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "fee_payments",
  }
);

module.exports = FeePayment;
