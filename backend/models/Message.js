const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const MessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["TEXT", "FILE"],
      default: "TEXT",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
