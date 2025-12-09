const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const BusSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
    },
    driverName: {
      type: String,
    },
    driverPhone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bus", BusSchema);
