const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FeeCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isRecurring: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeeCategory", FeeCategorySchema);
