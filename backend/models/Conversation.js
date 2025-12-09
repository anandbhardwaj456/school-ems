const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ConversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    type: {
      type: String,
      enum: ["DIRECT", "GROUP"],
      default: "DIRECT",
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
