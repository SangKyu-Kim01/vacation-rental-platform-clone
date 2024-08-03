const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  users: [
    {
      type: String,
      ref: "User",
    },
  ],
  userIDs: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seenBy: [
    {
      type: String,
      ref: "User",
    },
  ],
  messages: [
    {
      type: String,
      ref: "Message",
    },
  ],
  lastMessage: String,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
