const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const RouteSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    startPoint: {
      type: String,
    },
    endPoint: {
      type: String,
    },
    stops: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Route", RouteSchema);
