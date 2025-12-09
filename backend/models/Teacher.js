const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const TeacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    employeeCode: {
      type: String,
      unique: true,
    },
    designation: {
      type: String,
    },
    department: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
