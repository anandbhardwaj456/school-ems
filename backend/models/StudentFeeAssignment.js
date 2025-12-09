const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const StudentFeeAssignmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentFeeAssignment", StudentFeeAssignmentSchema);
