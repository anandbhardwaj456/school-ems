const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ConversationParticipantSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER"],
      default: "MEMBER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ConversationParticipant",
  ConversationParticipantSchema
);
