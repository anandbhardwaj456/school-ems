const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const BusRouteAssignmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    busId: {
      type: String,
      required: true,
    },
    routeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BusRouteAssignment", BusRouteAssignmentSchema);
