import React, { useEffect, useState } from "react";
import api from "../api";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [conversationsError, setConversationsError] = useState("");
  const [messagesError, setMessagesError] = useState("");

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchConversations = async () => {
    setConversationsLoading(true);
    setConversationsError("");
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data?.data || []);
    } catch (err) {
      setConversationsError(
        err.response?.data?.message ||
          "Failed to load conversations from server."
      );
    } finally {
      setConversationsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    setMessagesLoading(true);
    setMessagesError("");
    try {
      const res = await api.get(`/messages/conversations/${conversationId}/messages`);
      setMessages(res.data?.data || []);
    } catch (err) {
      setMessagesError(
        err.response?.data?.message || "Failed to load messages from server."
      );
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setMessages([]);
    fetchMessages(conversationId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConversationId || !newMessage.trim()) return;
    setSending(true);
    try {
      await api.post("/messages/messages", {
        conversationId: selectedConversationId,
        content: newMessage.trim(),
      });
      setNewMessage("");
      // Reload messages
      fetchMessages(selectedConversationId);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Messages</h2>
      <p className="text-sm text-slate-600">
        View your conversations and exchange messages with other users.
      </p>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex min-h-[360px]">
        {/* Conversations list */}
        <div className="w-64 border-r border-slate-200 flex flex-col">
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Conversations</p>
            {conversationsLoading && (
              <span className="text-xs text-slate-500">Loading...</span>
            )}
          </div>

          {conversationsError && (
            <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-200">
              {conversationsError}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && !conversationsLoading && (
              <p className="px-4 py-4 text-xs text-slate-500">
                No conversations found.
              </p>
            )}
            <ul className="divide-y divide-slate-200 text-sm">
              {conversations.map((c) => (
                <li key={c.conversationId || c.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectConversation(c.conversationId || c.id)
                    }
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 ${
                      (c.conversationId || c.id) === selectedConversationId
                        ? "bg-slate-100 text-primary-700"
                        : "text-slate-700"
                    }`}
                  >
                    <p className="text-xs font-medium">
                      {c.title || c.type || "Conversation"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {c.lastMessageSnippet || ""}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Messages panel */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              {selectedConversationId ? "Messages" : "Select a conversation"}
            </p>
            {messagesLoading && selectedConversationId && (
              <span className="text-xs text-slate-500">Loading...</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
            {!selectedConversationId && (
              <p className="text-xs text-slate-500">
                Choose a conversation from the left to view messages.
              </p>
            )}

            {messagesError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {messagesError}
              </div>
            )}

            {selectedConversationId &&
              messages.map((m) => (
                <div
                  key={m.messageId || m.id}
                  className="max-w-md rounded-lg border border-slate-200 px-3 py-2 bg-slate-50"
                >
                  <p className="text-xs text-slate-500 mb-1">
                    {m.senderName || `User ${m.senderId || ""}`} · {" "}
                    {formatTime(m.createdAt)}
                  </p>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {m.content}
                  </p>
                </div>
              ))}

            {selectedConversationId && !messagesLoading && messages.length === 0 && (
              <p className="text-xs text-slate-500">No messages yet.</p>
            )}
          </div>

          {/* Send box */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-slate-200 px-4 py-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={
                selectedConversationId
                  ? "Type a message and press Enter"
                  : "Select a conversation to start messaging"
              }
              disabled={!selectedConversationId}
            />
            <button
              type="submit"
              disabled={!selectedConversationId || sending || !newMessage.trim()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
