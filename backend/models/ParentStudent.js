const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ParentStudentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ParentStudent", ParentStudentSchema);
