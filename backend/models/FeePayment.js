const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FeePaymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    invoiceId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      enum: ["CASH", "ONLINE", "CHEQUE", "UPI"],
      required: true,
    },
    transactionRef: {
      type: String,
    },
    gateway: {
      type: String,
    },
    gatewayStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeePayment", FeePaymentSchema);
