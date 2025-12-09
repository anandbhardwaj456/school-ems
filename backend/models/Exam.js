const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ExamSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    examTypeId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    teacherId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "ONGOING", "COMPLETED", "PUBLISHED"],
      default: "SCHEDULED",
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", ExamSchema);
