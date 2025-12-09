const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FeePlanSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
    },
    academicYear: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeePlan", FeePlanSchema);
