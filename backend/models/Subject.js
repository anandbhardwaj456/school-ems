const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const SubjectSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", SubjectSchema);
