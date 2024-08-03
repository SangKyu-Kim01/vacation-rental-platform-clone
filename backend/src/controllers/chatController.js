const Chat = require("../models/chat");
const User = require("../models/user");

exports.addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    // Check if a chat with the same userIDs already exists
    const existingChat = await Chat.findOne({
      userIDs: { $all: [tokenUserId, receiverId] },
    });

    if (existingChat) {
      // Chat already exists
      console.log("Existing Chat:", existingChat);
      return res.status(200).json(existingChat);
    }

    // create a new chat
    const newChat = await Chat.create({
      userIDs: [tokenUserId, receiverId],
    });
    console.log("New Chat:", newChat);
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

exports.getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({
      userIDs: tokenUserId,
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      // Fetch receiver information
      const receiver = await User.findOne({
        auth0Id: receiverId,
      }).select({
        auth0Id: true,
        username: true,
        imageName: true,
        city: true,
      });

      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

exports.getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userIDs: tokenUserId,
    }).populate("messages");

    await Chat.updateOne(
      {
        _id: req.params.id,
      },
      {
        $addToSet: { seenBy: tokenUserId },
      }
    );

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

exports.readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.updateOne(
      {
        _id: req.params.id,
        userIDs: tokenUserId,
      },
      {
        $set: { seenBy: [tokenUserId] },
      }
    );
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
