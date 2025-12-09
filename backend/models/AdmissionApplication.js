const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const AdmissionApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    dob: {
      type: String,
    },
    classAppliedFor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "UNDER_ASSESSMENT",
        "ASSESSMENT_PASSED",
        "ASSESSMENT_FAILED",
        "ACCEPTED",
        "REJECTED",
      ],
      default: "PENDING",
    },
    assessmentDate: {
      type: Date,
    },
    assessmentScore: {
      type: Number,
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdmissionApplication", AdmissionApplicationSchema);
