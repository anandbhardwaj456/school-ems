const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    admissionNo: {
      type: String,
      unique: true,
    },
    classId: {
      type: String,
    },
    sectionId: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ALUMNI", "TC_ISSUED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", StudentSchema);
