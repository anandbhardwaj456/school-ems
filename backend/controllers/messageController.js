const Conversation = require("../models/Conversation");
const ConversationParticipant = require("../models/ConversationParticipant");
const Message = require("../models/Message");

exports.startConversation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { participantIds, type } = req.body; // participantIds: array of userIds (excluding self)

    if (!Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "participantIds array is required",
      });
    }

    const conv = await Conversation.create({
      type: type || "DIRECT",
      createdBy: req.user.id,
    });

    const allUserIds = [req.user.id, ...participantIds];
    const participants = allUserIds.map((uid) => ({
      conversationId: conv.conversationId,
      userId: uid,
      role: uid === req.user.id ? "ADMIN" : "MEMBER",
    }));

    await ConversationParticipant.insertMany(participants);

    res.status(201).json({ success: true, data: conv });
  } catch (err) {
    console.error("Start conversation error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { conversationId, content, type } = req.body;

    const conv = await Conversation.findOne({ conversationId });
    if (!conv) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    const msg = await Message.create({
      conversationId,
      senderId: req.user.id,
      content,
      type: type || "TEXT",
    });

    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    console.error("Send message error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { conversationId } = req.params;

    const msgs = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.json({ success: true, data: msgs });
  } catch (err) {
    console.error("List messages error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listUserConversations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const participantRows = await ConversationParticipant.find({
      userId: req.user.id,
    });

    const conversationIds = participantRows.map((p) => p.conversationId);

    const conversations = conversationIds.length
      ? await Conversation.find({
          conversationId: { $in: conversationIds },
        }).sort({ updatedAt: -1 })
      : [];

    res.json({ success: true, data: conversations });
  } catch (err) {
    console.error("List user conversations error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
