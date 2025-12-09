const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const TeacherSubjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TeacherSubject", TeacherSubjectSchema);
