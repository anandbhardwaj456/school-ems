const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const HomeworkSchema = new mongoose.Schema(
  {
    homeworkId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    classId: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    attachments: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Homework", HomeworkSchema);
