const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const AnnouncementSchema = new mongoose.Schema(
  {
    announcementId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["ALL", "CLASS", "SECTION", "ROLE", "STUDENT"],
      default: "ALL",
    },
    classId: {
      type: String,
    },
    sectionId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
    },
    studentId: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    validFrom: {
      type: Date,
    },
    validTo: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Announcement", AnnouncementSchema);
