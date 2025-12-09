const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const StudentTransportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    routeId: {
      type: String,
      required: true,
    },
    pickupStop: {
      type: String,
    },
    dropStop: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentTransport", StudentTransportSchema);
