const express = require("express");
const auth = require("../middlewares/auth");
const {
  startConversation,
  sendMessage,
  listMessages,
  listUserConversations,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/conversations", auth, startConversation);
router.get("/conversations", auth, listUserConversations);
router.post("/messages", auth, sendMessage);
router.get("/conversations/:conversationId/messages", auth, listMessages);

module.exports = router;
