const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FeeInvoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL", "OVERDUE"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeeInvoice", FeeInvoiceSchema);
