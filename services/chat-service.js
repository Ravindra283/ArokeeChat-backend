const chatModel = require('../models/chat-model');
const ChatModel = require('../models/chat-model');
const ObjectId = require('mongoose').Types.ObjectId;


/**
 * @param {Express.any} message
 * @return {Promise<any>}
 */
async function createChat(message) {
  try {
    const payload = message;
    const chat = new ChatModel({
      sender: {
        userId: message.sender.userId,
        name: message.sender.name
      },
      receiver: {
        userId: message.receiver.userId,
        name: message.receiver.name
      }
    })

    if (message.file) {
      chat.file = {
        name: message.fileName,
        path: message.fileName,
        size: message.fileSize
      }
    } else {
      chat.text = message.text
    }

    return await chat.save();
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @return {Promise<any>}
 */
async function getChatHistory(req, res) {
  try {
    const payload = req.params;
    const senderId = payload.senderId;
    const receiverId = payload.receiverId;
    const chatHistory = chatModel.find({
      $or: [
        {
          "receiver.userId": new ObjectId(receiverId),
          "sender.userId": new ObjectId(senderId)
        },
        {
          "receiver.userId": new ObjectId(senderId),
          "sender.userId": new ObjectId(receiverId)
        }
      ]
    });

    return chatHistory;
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  createChat,
  getChatHistory
};