const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ExamMarkSchema = new mongoose.Schema(
  {
    markId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    examId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    marksObtained: {
      type: Number,
    },
    attendanceStatus: {
      type: String,
      enum: ["PRESENT", "ABSENT", "MEDICAL", "EXEMPTED"],
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExamMark", ExamMarkSchema);
