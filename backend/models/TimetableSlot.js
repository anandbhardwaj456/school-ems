const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const TimetableSlotSchema = new mongoose.Schema(
  {
    slotId: {
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
    dayOfWeek: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TimetableSlot", TimetableSlotSchema);
