const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ClassSubjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    classId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClassSubject", ClassSubjectSchema);
