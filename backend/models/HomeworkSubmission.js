const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const HomeworkSubmissionSchema = new mongoose.Schema(
  {
    submissionId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    homeworkId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "LATE", "NOT_SUBMITTED"],
      default: "SUBMITTED",
    },
    submittedAt: {
      type: Date,
    },
    attachments: {
      type: Array,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HomeworkSubmission", HomeworkSubmissionSchema);
