const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const InviteTokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["teacher"],
      required: true,
    },
    email: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    maxUses: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "USED", "REVOKED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InviteToken", InviteTokenSchema);
