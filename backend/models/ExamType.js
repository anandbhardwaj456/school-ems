const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ExamTypeSchema = new mongoose.Schema(
  {
    examTypeId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    weightage: {
      type: Number,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamType", ExamTypeSchema);
