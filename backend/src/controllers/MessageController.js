const Message = require("../models/message");
const Chat = require("../models/chat");

exports.addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    // Check if the chat exists and the user is part of it
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Validate text field
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Message text is required!" });
    }

    // Create a new message
    const message = new Message({
      text,
      chatId,
      userId: tokenUserId,
    });

    // Save the message
    await message.save();

    // Update the chat's seenBy and lastMessage fields
    await Chat.updateOne(
      { _id: chatId },
      {
        $set: {
          seenBy: [tokenUserId],
          lastMessage: text,
        },
      }
    );

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
