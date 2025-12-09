const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ClassSchema = new mongoose.Schema(
  {
    classId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    academicYear: {
      type: String,
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

module.exports = mongoose.model("Class", ClassSchema);
