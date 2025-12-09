const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FeePlanItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    planId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeePlanItem", FeePlanItemSchema);
