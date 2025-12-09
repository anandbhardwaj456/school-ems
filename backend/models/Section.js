const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const SectionSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    classId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
    },
    classTeacherId: {
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

module.exports = mongoose.model("Section", SectionSchema);
