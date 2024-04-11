const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

const allMessages = asyncHandler(async (req, res) => {
  try {
    let  messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    messages = messages.map((message) => {
      message.content = cryptr.decrypt(message.content);
      return message;
    })
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;



  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  const encryptedString = cryptr.encrypt(content);

  var newMessage = {
    sender: req.user._id,
    content: encryptedString,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    message.content = cryptr.decrypt(message.content);
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };