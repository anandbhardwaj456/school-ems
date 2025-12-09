const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const AttendanceSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    date: {
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
    teacherId: {
      type: String,
    },
    period: {
      type: String,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AttendanceSession", AttendanceSessionSchema);
