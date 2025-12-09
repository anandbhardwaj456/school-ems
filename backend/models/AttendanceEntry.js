const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const AttendanceEntrySchema = new mongoose.Schema(
  {
    entryId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "HALF_DAY"],
      required: true,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AttendanceEntry", AttendanceEntrySchema);
